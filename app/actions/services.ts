"use server";

import { revalidatePath } from "next/cache";
import { runForgeops } from "@/lib/forgeops-exec";
import { getServicesOutputDirResolved } from "@/lib/user-forgeops-config";
import { enrichService, loadRegistry } from "@/lib/registry-read";
import { logActivitySafe } from "@/lib/activity-log";

function errMessage(r: { stdout: string; stderr: string; code: number }): string {
  const t = (r.stderr || r.stdout || "").trim();
  return t || `Forgeops exited with code ${r.code}`;
}

function buildCreateDetail(input: {
  template: string;
  language: string;
  port: number;
  db: string;
  messaging: string;
  ci: string;
  infra: string;
  auth: boolean;
  graphql: boolean;
  oauth: boolean;
  redis: boolean;
  observe: boolean;
  architecture: string;
}): string {
  const parts = [
    input.template,
    input.language,
    `port ${input.port}`,
    `db ${input.db}`,
    input.messaging !== "none" ? `msg ${input.messaging}` : null,
    `ci ${input.ci}`,
    input.infra !== "none" ? `infra ${input.infra}` : null,
    `arch ${input.architecture}`,
    input.auth ? "auth" : null,
    input.graphql && input.language === "node" ? "graphql" : null,
    input.oauth ? "oauth" : null,
    input.redis ? "redis" : null,
    input.observe ? "otel" : "no-otel",
  ].filter(Boolean);
  return parts.join(" · ");
}

export async function createServiceAction(input: {
  name: string;
  template: string;
  language: string;
  db: string;
  port: number;
  auth: boolean;
  architecture: string;
  messaging: string;
  ci: string;
  infra: string;
  graphql: boolean;
  oauth: boolean;
  redis: boolean;
  observe: boolean;
}) {
  if (input.architecture !== "clean") {
    throw new Error('Only architecture "clean" is supported.');
  }
  const outDir = await getServicesOutputDirResolved();
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
    input.messaging,
    "--ci",
    input.ci,
    "--infra",
    input.infra,
    "--arch",
    input.architecture,
    "--output",
    outDir,
  ];
  if (input.auth) args.push("--auth");
  if (input.graphql && input.language === "node") args.push("--graphql");
  if (input.oauth) args.push("--oauth");
  if (input.redis) args.push("--redis");
  if (!input.observe) args.push("--no-observe");

  const r = await runForgeops(args);
  if (r.code !== 0) throw new Error(errMessage(r));
  await logActivitySafe({
    type: "service_created",
    service: input.name.trim(),
    detail: buildCreateDetail(input),
  });
  revalidatePath("/services");
  revalidatePath("/services/new");
  revalidatePath("/");
}

export async function deleteServiceAction(input: { name: string; removeRepo: boolean }) {
  const args = ["delete", "service", input.name.trim()];
  if (input.removeRepo) args.push("--remove-repo");
  const r = await runForgeops(args);
  if (r.code !== 0) throw new Error(errMessage(r));
  await logActivitySafe({
    type: "service_deleted",
    service: input.name.trim(),
    detail: input.removeRepo ? "including repo delete attempt" : "local only",
  });
  revalidatePath("/services");
  revalidatePath(`/services/${encodeURIComponent(input.name)}`);
  revalidatePath("/");
}

export async function getServicesForList() {
  const raw = await loadRegistry();
  const enriched = await Promise.all(raw.map(enrichService));
  enriched.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return enriched;
}
