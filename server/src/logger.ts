import { context, trace, logs, SeverityNumber } from "@opentelemetry/api";

type Attributes = Record<string, string | number | boolean>;

function write(level: "info" | "warn" | "error", message: string, error?: unknown, attributes: Attributes = {}) {
  if (error instanceof Error) {
    attributes = { ...attributes, "exception.type": error.name, "exception.message": error.message,
      "exception.stacktrace": error.stack || "" };
  } else if (error !== undefined) {
    attributes = { ...attributes, "exception.message": String(error) };
  }

  const activeContext = context.active();
  const spanContext = trace.getSpanContext(activeContext);
  logs.getLogger("application").emit({
    context: activeContext,
    severityNumber: { info: SeverityNumber.INFO, warn: SeverityNumber.WARN, error: SeverityNumber.ERROR }[level],
    severityText: level.toUpperCase(),
    body: message,
    attributes,
  });

  const line = JSON.stringify({ time: new Date().toISOString(), level, message, ...attributes,
    ...(spanContext ? { trace_id: spanContext.traceId, span_id: spanContext.spanId } : {}) });
  (level === "error" ? process.stderr : process.stdout).write(line + "\n");
}

export const logger = {
  info: (message: string, attributes?: Attributes) => write("info", message, undefined, attributes),
  warn: (message: string, attributes?: Attributes) => write("warn", message, undefined, attributes),
  error: (message: string, error?: unknown, attributes?: Attributes) => write("error", message, error, attributes),
};
