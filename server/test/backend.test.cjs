const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const http = require("node:http");
const { test } = require("node:test");
const { setTimeout: delay } = require("node:timers/promises");
const { io } = require("socket.io-client");

test("backend exports correlated OTLP signals and preserves HTTP/Socket.IO authentication", { timeout: 30000 }, async (t) => {
  const records = [];
  const collector = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) { chunks.push(chunk); }
    records.push({ path: req.url, body: JSON.parse(Buffer.concat(chunks).toString()) });
    res.writeHead(200, { "Content-Type": "application/json" }).end("{}");
  });
  collector.listen(0, "127.0.0.1");
  await once(collector, "listening");
  t.after(() => new Promise((resolve) => collector.close(resolve)));

  // Reserve an available app port without depending on the production port.
  const reservation = http.createServer();
  reservation.listen(0, "127.0.0.1");
  await once(reservation, "listening");
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const base = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ["dist/server.js"], {
    env: { ...process.env, PORT: String(port),
      DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://unused:unused@127.0.0.1:1/unused",
      SESSION_SECRET: "test-session-secret", GOOGLE_CLIENT_ID: "test-client", GOOGLE_CLIENT_SECRET: "test-secret",
      GOOGLE_CALLBACK_URL: `${base}/api/auth/google/callback`,
      OTEL_EXPORTER_OTLP_ENDPOINT: `http://127.0.0.1:${collector.address().port}`,
      OTEL_RESOURCE_ATTRIBUTES: "k8s.pod.uid=test-pod,k8s.container.name=app",
      OTEL_SDK_DISABLED: "false", OTEL_METRIC_EXPORT_INTERVAL: "1000",
      OTEL_BSP_SCHEDULE_DELAY: "100", OTEL_BLRP_SCHEDULE_DELAY: "100",
    }, stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (data) => { output += data; });
  child.stderr.on("data", (data) => { output += data; });
  t.after(() => { if (child.exitCode === null) { child.kill("SIGKILL"); } });
  for (let i = 0; i < 200 && !output.includes("Server started"); i++) {
    assert.equal(child.exitCode, null, output);
    await delay(25);
  }
  assert.match(output, /Server started/);
  assert.equal((await fetch(`${base}/healthz`)).status, 200);
  assert.equal((await fetch(`${base}/api/room`, { method: "POST",
    headers: { "Content-Type": "application/json" }, body: "{" })).status, 400);
  const traceId = "0123456789abcdef0123456789abcdef";
  assert.equal((await fetch(`${base}/api/user`, {
    headers: { traceparent: `00-${traceId}-0123456789abcdef-01` },
  })).status, 401);
  for (const path of ["/missing/one", "/missing/two"]) {
    assert.equal((await fetch(base + path)).status, 404);
  }

  const unauthenticated = io(base, { path: "/api/socket.io", transports: ["websocket"], reconnection: false });
  const [authError] = await once(unauthenticated, "connect_error");
  unauthenticated.close();
  assert.match(authError.message, /Unauthorized/);

  if (process.env.TEST_DATABASE_URL) {
    const login = await fetch(`${base}/api/auth/local`, { redirect: "manual" });
    assert.equal(login.status, 302, output);
    const cookie = login.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
    assert.ok(cookie);
    const user = await fetch(`${base}/api/user`, { headers: { cookie } });
    assert.equal(user.status, 200);
    const created = await fetch(`${base}/api/room`, { method: "POST",
      headers: { cookie, "Content-Type": "application/json" }, body: JSON.stringify({ topic: "upgrade test" }) });
    assert.equal(created.status, 200, output);
    const room = await created.json();
    assert.equal((await fetch(`${base}/api/room/${room.id}`, { headers: { cookie } })).status, 200);
    const connection = io(base, { path: "/api/socket.io", transports: ["websocket"],
      extraHeaders: { cookie }, reconnection: false });
    await once(connection, "connect");
    connection.emit("join-room", { roomId: room.id });
    await once(connection, "get-users");
    connection.close();
  } else {
    t.diagnostic("Set TEST_DATABASE_URL and run prisma migrate deploy to include database/authenticated socket checks.");
  }

  await delay(1200);
  const exited = once(child, "exit");
  child.kill("SIGTERM");
  const [code] = await exited;
  assert.equal(code, 0, output);
  const spans = records.flatMap((r) => (r.body.resourceSpans || []).flatMap((resource) =>
    (resource.scopeSpans || []).flatMap((scope) => scope.spans || [])));
  assert.ok(spans.some((span) => span.traceId === traceId), JSON.stringify(spans));
  const logs = records.flatMap((r) => (r.body.resourceLogs || []).flatMap((resource) =>
    (resource.scopeLogs || []).flatMap((scope) => scope.logRecords || [])));
  assert.ok(logs.some((log) => log.traceId === traceId && log.body.stringValue === "HTTP request completed"));
  const metrics = records.flatMap((r) => (r.body.resourceMetrics || []).flatMap((resource) =>
    (resource.scopeMetrics || []).flatMap((scope) => scope.metrics || [])));
  assert.ok(metrics.some((metric) => metric.name === "http.server.request.duration"));
  assert.ok(metrics.some((metric) => metric.name === "socket.io.connections"));
  if (process.env.TEST_DATABASE_URL) {
    assert.ok(spans.some((span) => span.name.includes("prisma")), "Prisma database spans must be exported");
    assert.ok(JSON.stringify(metrics).includes("/api/room/:id"), "HTTP metrics must retain the parameterized route");
  }
  const metricText = JSON.stringify(metrics);
  assert.ok(!metricText.includes("trace_id"));
  assert.ok(!metricText.includes("/missing/one"));
  for (const record of records) {
    for (const resource of record.body.resourceSpans || record.body.resourceLogs || record.body.resourceMetrics || []) {
      assert.ok(resource.resource.attributes.some((attribute) => attribute.key === "k8s.pod.uid" && attribute.value.stringValue === "test-pod"));
    }
  }
});
