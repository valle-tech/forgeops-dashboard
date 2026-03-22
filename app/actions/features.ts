"use server";

import { revalidatePath } from "next/cache";
import { runForgeops } from "@/lib/forgeops-exec";
import { loadRegistry } from "@/lib/registry-read";
import {
  addAuthFeature,
  addCacheFeature,
  removeAuthFeature,
  removeCacheFeature,
} from "@/lib/extra-features";
import { readManifest } from "@/lib/manifest-fs";
import type { ManageableFeatureId } from "@/lib/constants";

function errMessage(r: { stdout: string; stderr: string; code: number }): string {
  const t = (r.stderr || r.stdout || "").trim();
  return t || `Forgeops exited with code ${r.code}`;
}

async function resolvePathForService(serviceName: string): Promise<string> {
  const list = await loadRegistry();
  const entry = list.find((s) => s.name === serviceName);
  if (!entry?.path) throw new Error(`Unknown service: ${serviceName}`);
  return entry.path;
}

export async function addFeatureAction(serviceName: string, feature: ManageableFeatureId) {
  const root = await resolvePathForService(serviceName);

  if (feature === "auth") {
    const m = await readManifest(root);
    const display = String(m.serviceName ?? m.name ?? serviceName);
    await addAuthFeature(root, display);
    revalidatePath("/services");
    revalidatePath(`/services/${encodeURIComponent(serviceName)}`);
    return;
  }

  if (feature === "cache") {
    const m = await readManifest(root);
    const display = String(m.serviceName ?? m.name ?? serviceName);
    await addCacheFeature(root, display);
    revalidatePath("/services");
    revalidatePath(`/services/${encodeURIComponent(serviceName)}`);
    return;
  }

  const r = await runForgeops(["add", "feature", serviceName, feature]);
  if (r.code !== 0) throw new Error(errMessage(r));
  revalidatePath("/services");
  revalidatePath(`/services/${encodeURIComponent(serviceName)}`);
}

export async function removeFeatureAction(serviceName: string, feature: ManageableFeatureId) {
  const root = await resolvePathForService(serviceName);

  if (feature === "auth") {
    await removeAuthFeature(root);
    revalidatePath("/services");
    revalidatePath(`/services/${encodeURIComponent(serviceName)}`);
    return;
  }

  if (feature === "cache") {
    await removeCacheFeature(root);
    revalidatePath("/services");
    revalidatePath(`/services/${encodeURIComponent(serviceName)}`);
    return;
  }

  const r = await runForgeops(["remove", "feature", serviceName, feature]);
  if (r.code !== 0) throw new Error(errMessage(r));
  revalidatePath("/services");
  revalidatePath(`/services/${encodeURIComponent(serviceName)}`);
}
