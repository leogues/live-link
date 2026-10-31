import { NextFunction, Request, Response } from "express";
import { context, SpanStatusCode, trace } from "@opentelemetry/api";
import { IN_PROGRESS, REQUESTS } from "../metrics";
import { logger } from "../logger";

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path === "/healthz") {
    next();
    return;
  }
  const requestContext = context.active();
  const method = req.method;
  const start = process.hrtime.bigint();
  IN_PROGRESS.add(1, { "http.request.method": method });
  let completed = false;
  const finish = () => {
    if (completed) { return; }
    completed = true;
    // Express resolves req.route during dispatch. IDs and query strings never
    // become metric labels; unmatched URLs share one value.
    const route = typeof req.route?.path === "string" ? req.baseUrl + req.route.path : "unmatched";
    const attributes = { "http.request.method": method, "http.route": route,
      "http.response.status_code": res.statusCode };
    const duration = Number(process.hrtime.bigint() - start) / 1e9;
    IN_PROGRESS.add(-1, { "http.request.method": method });
    REQUESTS.add(1, attributes, requestContext);
    context.with(requestContext, () => logger.info("HTTP request completed", { ...attributes, "duration.seconds": duration }));
  };
  res.once("finish", finish);
  res.once("close", finish);
  next();
}

export function errorMiddleware(error: unknown, _req: Request, res: Response, next: NextFunction) {
  const span = trace.getActiveSpan();
  if (error instanceof Error) { span?.recordException(error); }
  span?.setStatus({ code: SpanStatusCode.ERROR });
  const status = error && typeof error === "object" && "status" in error &&
    typeof error.status === "number" && error.status >= 400 && error.status <= 599 ? error.status : 500;
  if (status >= 500) { logger.error("HTTP request failed", error); }
  else { logger.warn("HTTP request rejected", { "http.response.status_code": status }); }
  if (res.headersSent) { next(error); return; }
  res.status(status).json({ error: status >= 500 ? "Internal server error" : "Bad request" });
}
