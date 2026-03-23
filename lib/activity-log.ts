import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { homedir } from "node:os";

export type ActivityType =
  | "service_created"
  | "service_deleted"
  | "deployed"
  | "built"
  | "tested"
  | "env_updated"
  | "forgeops_config_updated"
  | "feature_added"
  | "feature_removed"
  | "default_template_set";

export type ActivityEvent = {
  at: string;
  type: ActivityType;
  service?: string;
  detail?: string;
};

type FileShape = { events: ActivityEvent[] };

const MAX_EVENTS = 120;

function filePath(): string {
  return path.join(homedir(), ".forgeops", "dashboard-activity.json");
}

async function load(): Promise<FileShape> {
  try {
    const raw = await readFile(filePath(), "utf8");
    const j = JSON.parse(raw) as FileShape;
    return Array.isArray(j.events) ? j : { events: [] };
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return { events: [] };
    throw e;
  }
}

async function save(data: FileShape): Promise<void> {
  const dir = path.join(homedir(), ".forgeops");
  await mkdir(dir, { recursive: true });
  await writeFile(filePath(), JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function appendActivity(event: Omit<ActivityEvent, "at">): Promise<void> {
  const data = await load();
  const row: ActivityEvent = { ...event, at: new Date().toISOString() };
  data.events = [row, ...data.events].slice(0, MAX_EVENTS);
  await save(data);
}

export async function listRecentActivities(limit = 40): Promise<ActivityEvent[]> {
  const data = await load();
  return data.events.slice(0, limit);
}

export async function logActivitySafe(event: Omit<ActivityEvent, "at">): Promise<void> {
  try {
    await appendActivity(event);
  } catch {
  }
}
