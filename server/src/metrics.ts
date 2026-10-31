import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("application");

export const REQUESTS = meter.createCounter("http.server.requests", { description: "Completed HTTP requests" });
export const IN_PROGRESS = meter.createUpDownCounter("http.server.active_requests");
export const SOCKET_CONNECTIONS = meter.createCounter("socket.io.connections");
export const SOCKET_ACTIVE = meter.createUpDownCounter("socket.io.active_connections");
export const SOCKET_MESSAGES = meter.createCounter("socket.io.messages");
