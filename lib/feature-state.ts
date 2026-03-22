import type { ForgeopsManifest } from "./manifest-fs";

/** Effective capabilities for UI (manifest + CLI conventions). */
export function collectEnabledFeatures(m: ForgeopsManifest): string[] {
  const out = new Set<string>();
  for (const f of Array.isArray(m.features) ? m.features : []) {
    if (typeof f === "string") out.add(f);
  }
  if (m.auth) out.add("auth");
  if (m.messaging === "kafka") out.add("kafka");
  if (m.messaging === "rabbitmq") out.add("rabbitmq");
  return [...out].sort();
}

export function isFeatureEnabled(m: ForgeopsManifest, id: string): boolean {
  return collectEnabledFeatures(m).includes(id);
}
