"use server";

import { revalidatePath } from "next/cache";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { resolveServicePath } from "@/lib/service-resolve";
import { readEnvFile, writeEnvFile } from "@/lib/env-file";
import { readManifest } from "@/lib/manifest-fs";
import { logActivitySafe } from "@/lib/activity-log";

function revalidateServiceRoutes(name: string) {
  const enc = encodeURIComponent(name);
  revalidatePath(`/services/${enc}`);
  revalidatePath(`/services/${enc}/config`);
}

export async function getServiceConfigFiles(name: string): Promise<{
  envText: string;
  forgeopsJson: string;
  root: string;
} | null> {
  try {
    const root = await resolveServicePath(name);
    const envText = await readEnvFile(root);
    let forgeopsJson = "";
    try {
      const m = await readManifest(root);
      forgeopsJson = JSON.stringify(m, null, 2);
    } catch {
      forgeopsJson = "{}";
    }
    return { envText, forgeopsJson, root };
  } catch {
    return null;
  }
}

export async function saveServiceEnvAction(serviceName: string, content: string) {
  const root = await resolveServicePath(serviceName);
  await writeEnvFile(root, content);
  await logActivitySafe({ type: "env_updated", service: serviceName });
  revalidateServiceRoutes(serviceName);
  revalidatePath("/");
}

export async function saveServiceForgeopsAction(serviceName: string, jsonText: string) {
  const root = await resolveServicePath(serviceName);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonText) as Record<string, unknown>;
  } catch {
    throw new Error("Invalid JSON in service config");
  }
  const p = path.join(root, ".forgeops.json");
  await writeFile(p, JSON.stringify(parsed, null, 2) + "\n", "utf8");
  await logActivitySafe({ type: "forgeops_config_updated", service: serviceName });
  revalidateServiceRoutes(serviceName);
  revalidatePath("/");
}
