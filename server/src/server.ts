// Must run before Express, HTTP, Socket.IO and Prisma are imported.
import { shutdownTelemetry } from "./instrumentation";
import { server, socket } from "./app";
import prisma from "./database/client";
import { logger } from "./logger";

const port = Number(process.env.PORT || 8080);
server.listen(port, () => logger.info("Server started", { port }));

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) { return; }
  shuttingDown = true;
  const timeout = setTimeout(() => process.exit(1), 25000);
  timeout.unref();
  try {
    logger.info("Server shutting down", { signal });
    await new Promise<void>((resolve, reject) => socket.close((error?: Error) => error ? reject(error) : resolve()));
    await prisma.$disconnect();
  } catch (error) {
    logger.error("Server shutdown failed", error);
    process.exitCode = 1;
  } finally {
    try { await shutdownTelemetry(); } catch (error) {
      process.stderr.write(`Telemetry shutdown failed: ${String(error)}\n`);
      process.exitCode = 1;
    }
    clearTimeout(timeout);
  }
}

process.once("SIGTERM", () => { void shutdown("SIGTERM"); });
process.once("SIGINT", () => { void shutdown("SIGINT"); });
