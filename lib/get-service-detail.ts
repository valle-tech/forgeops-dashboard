import { cache } from "react";
import { enrichService, loadRegistry } from "@/lib/registry-read";
import { readManifest } from "@/lib/manifest-fs";
import { collectEnabledFeatures } from "@/lib/feature-state";

async function loadServiceDetail(name: string) {
  const list = await loadRegistry();
  const entry = list.find((s) => s.name === name);
  if (!entry) return null;
  const e = await enrichService(entry);
  let manifest = null as Awaited<ReturnType<typeof readManifest>> | null;
  let features: string[] = [];
  let configJson = "";
  if (e.status === "active") {
    try {
      manifest = await readManifest(e.path);
      features = collectEnabledFeatures(manifest);
      configJson = JSON.stringify(manifest, null, 2);
    } catch {
      configJson = "";
    }
  }
  return { entry: e, manifest, features, configJson };
}

export const getCachedServiceDetail = cache(loadServiceDetail);
