import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { homedir } from "node:os";
import { getServicesOutputDir } from "./paths";

export type DashboardDefaults = {
  defaultPort?: number;
  servicesOutputPath?: string;
};

export type UserForgeopsConfig = {
  github?: { token?: string };
  dashboard?: DashboardDefaults;
  [key: string]: unknown;
};

function configPath(): string {
  return path.join(homedir(), ".forgeops", "config.json");
}

export async function loadUserForgeopsConfig(): Promise<UserForgeopsConfig> {
  try {
    const raw = await readFile(configPath(), "utf8");
    return JSON.parse(raw) as UserForgeopsConfig;
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return {};
    throw e;
  }
}

export async function saveUserForgeopsConfig(data: UserForgeopsConfig): Promise<void> {
  const dir = path.join(homedir(), ".forgeops");
  await mkdir(dir, { recursive: true });
  await writeFile(configPath(), JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function maskSecret(value: string, visible = 4): string {
  const s = String(value || "");
  if (s.length <= visible) return "••••";
  return `${s.slice(0, 3)}••••${s.slice(-visible)}`;
}

export async function getServicesOutputDirResolved(): Promise<string> {
  if (process.env.FORGEOPS_SERVICES_OUTPUT) {
    return path.resolve(process.env.FORGEOPS_SERVICES_OUTPUT);
  }
  const cfg = await loadUserForgeopsConfig();
  const p = cfg.dashboard?.servicesOutputPath;
  if (p && String(p).trim()) return path.resolve(String(p).trim());
  return getServicesOutputDir();
}

/** Sync display path for pages that cannot await (fallback only). */
export function getServicesOutputDirSync(): string {
  return getServicesOutputDir();
}
