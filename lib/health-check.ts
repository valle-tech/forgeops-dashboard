export type HealthResult = {
  ok: boolean;
  path: string;
  status: number;
  latencyMs: number;
  error?: string;
};

const PATHS = ["/health", "/api/health", "/healthz"];

export async function probeHealth(port: number): Promise<HealthResult> {
  const bases = [`http://127.0.0.1:${port}`, `http://localhost:${port}`];
  let last: HealthResult | null = null;
  for (const base of bases) {
    for (const p of PATHS) {
      const url = `${base}${p}`;
      const t0 = Date.now();
      try {
        const res = await fetch(url, {
          method: "GET",
          signal: AbortSignal.timeout(4000),
          headers: { Accept: "application/json, text/plain, */*" },
        });
        const latencyMs = Date.now() - t0;
        if (res.ok) {
          return { ok: true, path: p, status: res.status, latencyMs };
        }
        last = { ok: false, path: p, status: res.status, latencyMs };
      } catch (e) {
        last = {
          ok: false,
          path: p,
          status: 0,
          latencyMs: Date.now() - t0,
          error: e instanceof Error ? e.message : String(e),
        };
      }
    }
  }
  return last ?? { ok: false, path: "/health", status: 0, latencyMs: 0, error: "unreachable" };
}
