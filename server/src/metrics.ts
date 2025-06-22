import { Counter, Gauge, Histogram, Registry } from "prom-client";
import { Request, Response } from "express";

export const registry = new Registry();

export const INFO = new Gauge({
  name: "app_info",
  help: "Application info",
  labelNames: ["service"],
  registers: [registry],
});

INFO.labels("live-link").set(1);

export const REQUESTS = new Counter({
  name: "requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "service"],
  registers: [registry],
});

export const RESPONSES = new Counter({
  name: "responses_total",
  help: "Total HTTP responses",
  labelNames: ["method", "route", "status", "service"],
  registers: [registry],
});

export const EXCEPTIONS = new Counter({
  name: "exceptions_total",
  help: "Total exceptions",
  labelNames: ["method", "route", "type", "service"],
  registers: [registry],
});

export const DURATION = new Histogram({
  name: "request_duration_seconds",
  help: "Request duration in seconds",
  labelNames: ["method", "route", "service", "trace_id"],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
  registers: [registry],
});

export const IN_PROGRESS = new Gauge({
  name: "requests_in_progress",
  help: "In-progress requests",
  labelNames: ["method", "route", "service"],
  registers: [registry],
});

export const SOCKET_CONNECTIONS = new Counter({
  name: "socket_connections_total",
  help: "Total Socket.IO connections",
  labelNames: ["service"],
  registers: [registry],
});

export const SOCKET_ACTIVE = new Gauge({
  name: "socket_active_connections",
  help: "Active Socket.IO connections",
  labelNames: ["service"],
  registers: [registry],
});

export const SOCKET_MESSAGES = new Counter({
  name: "socket_messages_total",
  help: "Total Socket.IO messages",
  labelNames: ["event", "service"],
  registers: [registry],
});

export async function metricsEndpoint(_: Request, res: Response) {
  res.setHeader("Content-Type", registry.contentType);
  const metrics = await registry.metrics();
  res.send(metrics);
}
