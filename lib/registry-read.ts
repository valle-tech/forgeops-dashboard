import { readFile, stat, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { registryFilePath } from "./paths";

export type RegistryEntry = {
  name: string;
  slug?: string;
  path: string;
  template?: string;
  language?: string;
  database?: string;
  messaging?: string;
  auth?: boolean;
  httpPort?: number;
  port?: number;
  repoUrl?: string;
  createdAt?: string;
};

type RegistryFile = { services?: Record<string, RegistryEntry> };

export async function loadRegistry(): Promise<RegistryEntry[]> {
  const p = registryFilePath();
  try {
    const raw = await readFile(p, "utf8");
    const j = JSON.parse(raw) as RegistryFile;
    const map = j.services && typeof j.services === "object" ? j.services : {};
    return Object.values(map);
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return [];
    throw e;
  }
}

export type EnrichedService = RegistryEntry & {
  status: "active" | "missing";
  lastUpdated: string;
};

export async function enrichService(entry: RegistryEntry): Promise<EnrichedService> {
  let status: "active" | "missing" = "missing";
  let lastUpdated = entry.createdAt ?? new Date(0).toISOString();
  try {
    await access(entry.path, constants.F_OK);
    status = "active";
    try {
      const st = await stat(path.join(entry.path, ".forgeops.json"));
      lastUpdated = st.mtime.toISOString();
    } catch {
      try {
        const st = await stat(entry.path);
        lastUpdated = st.mtime.toISOString();
      } catch {
        /* keep */
      }
    }
  } catch {
    status = "missing";
  }
  return { ...entry, status, lastUpdated };
}

export async function listEnrichedServices(): Promise<EnrichedService[]> {
  const list = await loadRegistry();
  return Promise.all(list.map(enrichService));
}
