import path from "node:path";
import { readFile } from "node:fs/promises";
import { getForgeopsCliBin } from "./paths";

export function getCliPackageRoot(): string {
  const bin = getForgeopsCliBin();
  return path.dirname(path.dirname(bin));
}

export async function readCliPackageJson(): Promise<{ name?: string; version?: string }> {
  const p = path.join(getCliPackageRoot(), "package.json");
  const raw = await readFile(p, "utf8");
  return JSON.parse(raw) as { name?: string; version?: string };
}

export function getCliBuiltinTemplatesDir(): string {
  return path.join(getCliPackageRoot(), "templates");
}
