import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { homedir } from "node:os";

export type OpRecord = {
  at: string;
  ok: boolean;
  output: string;
};

export type ServiceOpsState = {
  lastDeploy?: OpRecord;
  lastBuild?: OpRecord;
  lastTest?: OpRecord;
};

type StateFile = {
  services: Record<string, ServiceOpsState>;
};

function statePath(): string {
  return path.join(homedir(), ".forgeops", "dashboard-state.json");
}

async function load(): Promise<StateFile> {
  try {
    const raw = await readFile(statePath(), "utf8");
    const j = JSON.parse(raw) as StateFile;
    return j.services ? j : { services: {} };
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return { services: {} };
    throw e;
  }
}

async function save(data: StateFile): Promise<void> {
  const dir = path.join(homedir(), ".forgeops");
  await mkdir(dir, { recursive: true });
  await writeFile(statePath(), JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function getServiceOpsState(name: string): Promise<ServiceOpsState> {
  const data = await load();
  return data.services[name] ?? {};
}

export async function recordOp(
  name: string,
  kind: "deploy" | "build" | "test",
  result: { ok: boolean; output: string },
): Promise<void> {
  const data = await load();
  data.services = data.services || {};
  const cur = data.services[name] || {};
  const rec: OpRecord = {
    at: new Date().toISOString(),
    ok: result.ok,
    output: truncate(result.output, 12000),
  };
  if (kind === "deploy") cur.lastDeploy = rec;
  if (kind === "build") cur.lastBuild = rec;
  if (kind === "test") cur.lastTest = rec;
  data.services[name] = cur;
  await save(data);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n… (truncated)";
}
