import { runForgeops } from "@/lib/forgeops-exec";
import { resolveServicePath } from "@/lib/service-resolve";
import { readManifest } from "@/lib/manifest-fs";
import { ghRunListJson, dockerComposeLogsTail } from "@/lib/exec-captured";
import { probeHealth } from "@/lib/health-check";
import { summarizeMetricsText } from "@/lib/metrics-parse";
import { loadRegistry } from "@/lib/registry-read";
import { githubActionsUrl, githubWorkflowUrl } from "@/lib/github-url";

export type GhRunRow = {
  databaseId: string;
  conclusion: string | null;
  displayTitle: string;
  status: string;
  createdAt: string;
  url: string;
  headBranch: string;
};

export async function getServiceLogsBundle(serviceName: string): Promise<{
  text: string;
  source: "docker" | "forgeops" | "none";
  error?: string;
}> {
  try {
    const root = await resolveServicePath(serviceName);
    let slug = `${serviceName}-service`;
    try {
      const m = await readManifest(root);
      slug = String(m.serviceSlug || m.slug || slug);
    } catch {
      /* keep */
    }
    const d = await dockerComposeLogsTail(root, slug, 250);
    if (d.code === 0 && d.stdout.trim()) {
      return { text: d.stdout + d.stderr, source: "docker" };
    }
    const r = await runForgeops(["logs", serviceName, "--no-follow"]);
    const text = r.stdout + r.stderr;
    if (r.code === 0 || text.trim()) {
      return { text, source: "forgeops" };
    }
    return {
      text: "",
      source: "none",
      error: d.stderr || d.stdout || "No compose logs; ensure containers are running.",
    };
  } catch (e) {
    return {
      text: "",
      source: "none",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function getServiceMetricsBundle(serviceName: string): Promise<{
  raw: string;
  ok: boolean;
  summary: ReturnType<typeof summarizeMetricsText> | null;
  error?: string;
}> {
  const r = await runForgeops(["metrics", serviceName]);
  const raw = r.stdout + r.stderr;
  if (r.code === 0 && raw.trim()) {
    return { raw, ok: true, summary: summarizeMetricsText(raw) };
  }
  return {
    raw,
    ok: false,
    summary: raw.trim() ? summarizeMetricsText(raw) : null,
    error: raw.trim() || `Metrics unavailable (exit ${r.code}). Is the service running?`,
  };
}

export async function getServiceHealthProbe(serviceName: string): Promise<
  Awaited<ReturnType<typeof probeHealth>> & { port: number }
> {
  let port = 3000;
  try {
    const root = await resolveServicePath(serviceName);
    const m = await readManifest(root);
    port = Number(m.httpPort ?? m.port ?? 3000) || 3000;
  } catch {
    /* default */
  }
  const h = await probeHealth(port);
  return { ...h, port };
}

export async function getCiRunsForService(serviceName: string): Promise<{
  runs: GhRunRow[];
  error?: string;
  actionsUrl: string | null;
  workflowUrl: string | null;
}> {
  const list = await loadRegistry();
  const entry = list.find((s) => s.name === serviceName);
  const repoUrl = entry?.repoUrl?.trim() || "";
  const actionsUrl = repoUrl ? githubActionsUrl(repoUrl) : null;
  const workflowUrl = repoUrl ? githubWorkflowUrl(repoUrl, "ci.yml") : null;

  if (!entry?.path) {
    return { runs: [], error: "Service path unknown", actionsUrl, workflowUrl };
  }

  const gh = await ghRunListJson(entry.path, 10);
  if (gh.code !== 0) {
    return {
      runs: [],
      error: (gh.stderr || gh.stdout || "Could not list runs (is gh installed and authenticated?)").trim(),
      actionsUrl,
      workflowUrl,
    };
  }
  try {
    const runs = JSON.parse(gh.stdout) as GhRunRow[];
    return { runs: Array.isArray(runs) ? runs : [], actionsUrl, workflowUrl };
  } catch {
    return { runs: [], error: "Failed to parse gh output", actionsUrl, workflowUrl };
  }
}

export { summarizeMetricsText };
