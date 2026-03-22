"use server";

import { revalidatePath } from "next/cache";
import {
  loadUserForgeopsConfig,
  saveUserForgeopsConfig,
  type UserForgeopsConfig,
} from "@/lib/user-forgeops-config";
import { logActivitySafe } from "@/lib/activity-log";

export async function setDefaultTemplateAction(templateId: string) {
  const id = templateId.trim();
  if (!id) throw new Error("Template id required");
  const cfg = await loadUserForgeopsConfig();
  const next = structuredClone(cfg) as UserForgeopsConfig;
  const dash =
    typeof next.dashboard === "object" && next.dashboard ? { ...next.dashboard } : {};
  next.dashboard = dash;
  dash.defaultTemplate = id;
  await saveUserForgeopsConfig(next);
  await logActivitySafe({ type: "default_template_set", detail: id });
  revalidatePath("/templates");
  revalidatePath("/settings");
  revalidatePath("/services/new");
  revalidatePath("/");
}

