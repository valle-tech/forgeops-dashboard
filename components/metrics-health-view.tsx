import type { HealthResult } from "@/lib/health-check";

type Health = HealthResult & { port: number };

type MetricsSummary = {
  lineCount: number;
  requestHints: number;
  errorHints: number;
  sample: string;
};

type Metrics = {
  raw: string;
  ok: boolean;
  summary: MetricsSummary | null;
  error?: string;
};

export function MetricsHealthView({ metrics, health }: { metrics: Metrics; health: Health }) {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Health</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Probing <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">127.0.0.1:{health.port}</code>{" "}
          on /health, /api/health, /healthz.
        </p>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={
                health.ok
                  ? "text-lg font-semibold text-emerald-700 dark:text-emerald-400"
                  : "text-lg font-semibold text-red-700 dark:text-red-400"
              }
            >
              {health.ok ? "Healthy" : "Unhealthy"}
            </span>
            {!health.ok && health.error ? (
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{health.error}</span>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Matched path: {health.path} · HTTP {health.status} · {health.latencyMs}ms
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Metrics</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          From <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">forgeops metrics</code> (Prometheus
          text if exposed).
        </p>
        {metrics.summary && (
          <ul className="list-inside list-disc text-sm text-zinc-700 dark:text-zinc-300">
            <li>Metric lines (excl. comments): {metrics.summary.lineCount}</li>
            <li>Lines mentioning requests / RPC: {metrics.summary.requestHints}</li>
            <li>Lines mentioning errors / 5xx: {metrics.summary.errorHints}</li>
          </ul>
        )}
        {metrics.error && !metrics.ok ? (
          <p className="text-sm text-amber-800 dark:text-amber-200">{metrics.error}</p>
        ) : null}
        <pre className="max-h-80 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          {metrics.summary?.sample || metrics.raw || "—"}
        </pre>
      </section>
    </div>
  );
}
