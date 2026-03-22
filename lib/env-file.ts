import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function readEnvFile(root: string): Promise<string> {
  const p = path.join(root, ".env");
  try {
    return await readFile(p, "utf8");
  } catch {
    return "";
  }
}

export async function writeEnvFile(root: string, content: string): Promise<void> {
  const p = path.join(root, ".env");
  const normalized = content.replace(/\n+$/, "") + "\n";
  await writeFile(p, normalized, "utf8");
}
