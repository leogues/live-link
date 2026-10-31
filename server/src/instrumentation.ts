import "dotenv/config";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { SocketIoInstrumentation } from "@opentelemetry/instrumentation-socket.io";
import { RuntimeNodeInstrumentation } from "@opentelemetry/instrumentation-runtime-node";

const enabled = process.env.OTEL_SDK_DISABLED !== "true" && Boolean(
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
  process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
  process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT ||
  process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT
);

// Exporters read standard OTEL_* variables. Kubernetes identity is added by
// the Collector; no service name, namespace or version is hardcoded here.
const sdk = enabled ? new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  logRecordProcessors: [new BatchLogRecordProcessor({ exporter: new OTLPLogExporter() })],
  metricReaders: [new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
    exportIntervalMillis: Number(process.env.OTEL_METRIC_EXPORT_INTERVAL || 60000),
  })],
  instrumentations: [
    new HttpInstrumentation({
      ignoreIncomingRequestHook: (req) => req.url?.split("?")[0] === "/healthz",
    }),
    new ExpressInstrumentation(),
    new PrismaInstrumentation(),
    new SocketIoInstrumentation(),
    new RuntimeNodeInstrumentation(),
  ],
}) : undefined;

sdk?.start();

export async function shutdownTelemetry(): Promise<void> {
  await sdk?.shutdown();
}
