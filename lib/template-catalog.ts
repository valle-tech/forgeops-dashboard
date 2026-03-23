import path from "node:path";
import { readdir, readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { getCliBuiltinTemplatesDir } from "./cli-package";

export type TemplateSource = "builtin" | "custom";

export type TemplateListItem = {
  id: string;
  source: TemplateSource;
  path: string;
};

function customTemplatesRoot(): string {
  return path.join(homedir(), ".forgeops", "templates");
}

export async function listAllTemplates(): Promise<TemplateListItem[]> {
  const byId = new Map<string, TemplateListItem>();
  const builtinRoot = getCliBuiltinTemplatesDir();
  try {
    const entries = await readdir(builtinRoot, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        byId.set(e.name, { id: e.name, source: "builtin", path: path.join(builtinRoot, e.name) });
      }
    }
  } catch {
  }
  const croot = customTemplatesRoot();
  try {
    const entries = await readdir(croot, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        byId.set(e.name, { id: e.name, source: "custom", path: path.join(croot, e.name) });
      }
    }
  } catch {
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export async function resolveTemplateDir(id: string): Promise<{ id: string; path: string; source: TemplateSource } | null> {
  const all = await listAllTemplates();
  const hit = all.find((t) => t.id === id);
  return hit ?? null;
}

export type TemplateDetail = {
  id: string;
  path: string;
  source: TemplateSource;
  stack: string;
  topEntries: string[];
  readmeExcerpt: string | null;
  featuresIncluded: string[];
};

const FEATURES_BY_ID: Record<string, string[]> = {
  "nestjs-clean": [
    "NestJS HTTP API (optional GraphQL)",
    "Health + readiness + /metrics",
    "Structured JSON logging + request id",
    "Sample payments module (DDD-style)",
    "Optional JWT + RBAC",
    "Optional OpenTelemetry → OTLP",
    "Dockerfile + docker-compose (+ optional Redis)",
    "GitHub Actions CI (test, Docker, env deploy placeholders)",
    "Env validation",
  ],
  "go-clean": [
    "Go net/http + ServeMux",
    "Health + payments modules",
    "JSON request logging",
    "Optional JWT + OTEL",
    "Dockerfile + docker-compose",
    "GitHub Actions CI",
  ],
  "python-clean": [
    "FastAPI app + modular routers",
    "Health + payments routes",
    "Optional JWT + OTEL",
    "Dockerfile + docker-compose",
    "GitHub Actions CI",
    "pytest (unit + integration)",
  ],
};

function defaultFeaturesFor(id: string): string[] {
  return FEATURES_BY_ID[id] ?? ["Scaffolded service layout", "Docker support when enabled at create time", "CI file when github selected"];
}

export async function getTemplateDetail(id: string): Promise<TemplateDetail | null> {
  const resolved = await resolveTemplateDir(id);
  if (!resolved) return null;
  const root = resolved.path;

  let stack = "unknown";
  try {
    await stat(path.join(root, "package.json"));
    stack = "Node (package.json)";
  } catch {
    try {
      await stat(path.join(root, "go.mod"));
      stack = "Go (go.mod)";
    } catch {
      try {
        await stat(path.join(root, "requirements.txt"));
        stack = "Python (requirements.txt)";
      } catch {
      }
    }
  }

  const entries = await readdir(root, { withFileTypes: true });
  const topEntries = entries
    .filter((e) => e.isDirectory() || /\.(json|ya?ml|md|txt)$/i.test(e.name))
    .map((e) => e.name)
    .sort()
    .slice(0, 32);

  let readmeExcerpt: string | null = null;
  for (const readme of ["README.md", "readme.md"]) {
    try {
      const raw = await readFile(path.join(root, readme), "utf8");
      readmeExcerpt = raw
        .trim()
        .split("\n")
        .slice(0, 14)
        .join("\n");
      break;
    } catch {
    }
  }

  return {
    id: resolved.id,
    path: root,
    source: resolved.source,
    stack,
    topEntries,
    readmeExcerpt,
    featuresIncluded: defaultFeaturesFor(resolved.id),
  };
}
