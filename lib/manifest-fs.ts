import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";

const FORGEOPS_JSON = ".forgeops.json";

export type ForgeopsManifest = Record<string, unknown> & {
  name?: string;
  serviceName?: string;
  template?: string;
  port?: number;
  httpPort?: number;
  slug?: string;
  serviceSlug?: string;
  language?: string;
  database?: string;
  messaging?: string;
  auth?: boolean;
  repoUrl?: string;
  features?: string[];
};

export async function readManifest(root: string): Promise<ForgeopsManifest> {
  const p = path.join(root, FORGEOPS_JSON);
  const raw = await readFile(p, "utf8");
  return JSON.parse(raw) as ForgeopsManifest;
}

export async function patchManifest(
  root: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const p = path.join(root, FORGEOPS_JSON);
  const j = JSON.parse(await readFile(p, "utf8")) as Record<string, unknown>;
  Object.assign(j, patch);
  await writeFile(p, JSON.stringify(j, null, 2) + "\n", "utf8");
}

export async function appendManifestFeature(root: string, featureId: string): Promise<void> {
  const p = path.join(root, FORGEOPS_JSON);
  const j = JSON.parse(await readFile(p, "utf8")) as ForgeopsManifest;
  const list = Array.isArray(j.features) ? [...j.features] : [];
  if (!list.includes(featureId)) list.push(featureId);
  j.features = list;
  await writeFile(p, JSON.stringify(j, null, 2) + "\n", "utf8");
}

export async function removeManifestFeature(root: string, featureId: string): Promise<void> {
  const p = path.join(root, FORGEOPS_JSON);
  const j = JSON.parse(await readFile(p, "utf8")) as ForgeopsManifest;
  if (!Array.isArray(j.features)) return;
  j.features = j.features.filter((x) => x !== featureId);
  await writeFile(p, JSON.stringify(j, null, 2) + "\n", "utf8");
}

export async function mergeEnvFile(
  root: string,
  entries: Record<string, string>,
): Promise<void> {
  const p = path.join(root, ".env");
  let content = "";
  try {
    content = await readFile(p, "utf8");
  } catch {
  }
  const lines = content.split("\n");
  const keys = new Set(
    lines
      .filter((l) => l.trim() && !l.trim().startsWith("#"))
      .map((l) => l.split("=")[0]?.trim())
      .filter(Boolean),
  );
  let changed = false;
  for (const [k, v] of Object.entries(entries)) {
    if (keys.has(k)) continue;
    lines.push(`${k}=${v}`);
    keys.add(k);
    changed = true;
  }
  const out = lines.join("\n").replace(/\n+$/, "") + "\n";
  if (changed || !content) await writeFile(p, out, "utf8");
}

export async function removeEnvKeys(root: string, keys: string[]): Promise<void> {
  const set = new Set(keys);
  const p = path.join(root, ".env");
  let content: string;
  try {
    content = await readFile(p, "utf8");
  } catch {
    return;
  }
  const lines = content.split("\n");
  const next = lines.filter((l) => {
    const trimmed = l.trim();
    if (!trimmed || trimmed.startsWith("#")) return true;
    const k = l.split("=")[0]?.trim();
    return !set.has(k);
  });
  await writeFile(p, next.join("\n").replace(/\n+$/, "") + "\n", "utf8");
}

export async function removeDoc(root: string, filename: string): Promise<void> {
  await rm(path.join(root, filename), { force: true }).catch(() => {});
}
