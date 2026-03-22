"use server";

import { revalidatePath } from "next/cache";
import {
  loadUserForgeopsConfig,
  saveUserForgeopsConfig,
  maskSecret,
  type UserForgeopsConfig,
} from "@/lib/user-forgeops-config";
import { logActivitySafe } from "@/lib/activity-log";

function safeConfigPreview(cfg: UserForgeopsConfig): string {
  const c = JSON.parse(JSON.stringify(cfg)) as Record<string, unknown>;
  const gh = c.github;
  if (gh && typeof gh === "object" && gh !== null && "token" in gh) {
    const t = (gh as { token?: string }).token;
    (gh as { token?: string }).token = t ? maskSecret(String(t)) : undefined;
  }
  return JSON.stringify(c, null, 2);
}

export type SettingsView = {
  githubTokenSet: boolean;
  githubTokenPreview: string | null;
  defaultPort: number | null;
  servicesOutputPath: string | null;
  defaultTemplate: string | null;
  rawJsonPreview: string;
};

export async function getGlobalSettingsView(): Promise<SettingsView> {
  const cfg = await loadUserForgeopsConfig();
  const token = cfg.github?.token;
  const dash = cfg.dashboard ?? {};
  return {
    githubTokenSet: Boolean(token && String(token).trim()),
    githubTokenPreview: token ? maskSecret(String(token)) : null,
    defaultPort:
      typeof dash.defaultPort === "number" && Number.isFinite(dash.defaultPort)
        ? dash.defaultPort
        : null,
    servicesOutputPath:
      typeof dash.servicesOutputPath === "string" && dash.servicesOutputPath.trim()
        ? dash.servicesOutputPath.trim()
        : null,
    defaultTemplate:
      typeof dash.defaultTemplate === "string" && dash.defaultTemplate.trim()
        ? dash.defaultTemplate.trim()
        : null,
    rawJsonPreview: safeConfigPreview(cfg),
  };
}

export async function saveGlobalSettingsAction(input: {
  githubToken?: string;
  defaultPort?: string;
  servicesOutputPath?: string;
  defaultTemplate?: string;
}) {
  const cfg = await loadUserForgeopsConfig();
  const next = structuredClone(cfg) as UserForgeopsConfig;
  const prevTemplate =
    typeof cfg.dashboard === "object" && cfg.dashboard && typeof cfg.dashboard.defaultTemplate === "string"
      ? cfg.dashboard.defaultTemplate
      : null;

  if (input.githubToken !== undefined && input.githubToken.trim()) {
    next.github = { ...(typeof next.github === "object" && next.github ? next.github : {}), token: input.githubToken.trim() };
  }

  const dash =
    typeof next.dashboard === "object" && next.dashboard ? { ...next.dashboard } : {};
  next.dashboard = dash;
  if (input.defaultPort !== undefined && input.defaultPort.trim()) {
    const n = parseInt(input.defaultPort, 10);
    if (!Number.isNaN(n)) dash.defaultPort = n;
  }
  if (input.servicesOutputPath !== undefined && input.servicesOutputPath.trim()) {
    dash.servicesOutputPath = input.servicesOutputPath.trim();
  }
  if (input.defaultTemplate !== undefined && input.defaultTemplate.trim()) {
    const t = input.defaultTemplate.trim();
    dash.defaultTemplate = t;
    if (t !== prevTemplate) {
      await logActivitySafe({ type: "default_template_set", detail: t });
    }
  }

  await saveUserForgeopsConfig(next);
  revalidatePath("/settings");
  revalidatePath("/services/new");
  revalidatePath("/templates");
  revalidatePath("/");
}
