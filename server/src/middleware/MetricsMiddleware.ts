import { NextFunction, Request, Response } from "express";
import { trace } from "@opentelemetry/api";
import {
  INFO,
  REQUESTS,
  RESPONSES,
  EXCEPTIONS,
  DURATION,
  IN_PROGRESS,
} from "../metrics";

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const method = req.method;
  const route = req.route?.path || req.path;
  const labels = { method, route, service: "live-link" };

  INFO.labels("live-link").set(1);
  IN_PROGRESS.inc(labels);
  REQUESTS.inc(labels);
  const start = process.hrtime();
  res.on("finish", () => {
    const status = res.statusCode.toString();
    RESPONSES.inc({ ...labels, status });

    const [s, ns] = process.hrtime(start);
    const seconds = s + ns / 1e9;

    const currentSpan = trace.getActiveSpan();
    const traceId = currentSpan?.spanContext().traceId || "unknown";

    DURATION.observe({ ...labels, trace_id: traceId }, seconds);

    IN_PROGRESS.dec(labels);
  });

  try {
    next();
  } catch (err: any) {
    EXCEPTIONS.inc({ ...labels, type: err.constructor.name });
    throw err;
  }
}
