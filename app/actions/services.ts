"use server";

import { revalidatePath } from "next/cache";
import { runForgeops } from "@/lib/forgeops-exec";
import { getServicesOutputDir } from "@/lib/paths";
import { enrichService, loadRegistry } from "@/lib/registry-read";
import { readManifest } from "@/lib/manifest-fs";
import { collectEnabledFeatures } from "@/lib/feature-state";

function errMessage(r: { stdout: string; stderr: string; code: number }): string {
  const t = (r.stderr || r.stdout || "").trim();
  return t || `Forgeops exited with code ${r.code}`;
}

export async function createServiceAction(input: {
  name: string;
  template: string;
  language: string;
  db: string;
  port: number;
  auth: boolean;
}) {
  const outDir = getServicesOutputDir();
  const args = [
    "create",
    "service",
    input.name.trim(),
    "--no-interactive",
    "--template",
    input.template,
    "--language",
    input.language,
    "--db",
    input.db,
    "--port",
    String(input.port),
    "--messaging",
    "none",
    "--ci",
    "github",
    "--infra",
    "none",
    "--output",
    outDir,
  ];
  if (input.auth) args.push("--auth");

  const r = await runForgeops(args);
  if (r.code !== 0) throw new Error(errMessage(r));
  revalidatePath("/services");
  revalidatePath("/services/new");
}

export async function deleteServiceAction(input: { name: string; removeRepo: boolean }) {
  const args = ["delete", "service", input.name.trim()];
  if (input.removeRepo) args.push("--remove-repo");
  const r = await runForgeops(args);
  if (r.code !== 0) throw new Error(errMessage(r));
  revalidatePath("/services");
  revalidatePath(`/services/${encodeURIComponent(input.name)}`);
}

export async function getServicesForList() {
  const raw = await loadRegistry();
  const enriched = await Promise.all(raw.map(enrichService));
  enriched.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return enriched;
}

export async function getServiceDetail(name: string) {
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
