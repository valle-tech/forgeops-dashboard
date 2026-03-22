import { loadRegistry } from "./registry-read";

export async function resolveServicePath(name: string): Promise<string> {
  const list = await loadRegistry();
  const entry = list.find((s) => s.name === name);
  if (!entry?.path) throw new Error(`Unknown service: ${name}`);
  return entry.path;
}
