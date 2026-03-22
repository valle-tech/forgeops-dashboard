import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { getForgeopsCliBin } from "./paths";

export type ForgeopsResult = {
  code: number;
  stdout: string;
  stderr: string;
};

export async function assertCliAvailable(): Promise<void> {
  const bin = getForgeopsCliBin();
  try {
    await access(bin, constants.F_OK);
  } catch {
    throw new Error(
      `Forgeops CLI not found at ${bin}. Set FORGEOPS_CLI_ROOT to your cli package root.`,
    );
  }
}

export async function runForgeops(
  args: string[],
  options?: { cwd?: string },
): Promise<ForgeopsResult> {
  await assertCliAvailable();
  const bin = getForgeopsCliBin();
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [bin, ...args], {
      cwd: options?.cwd ?? process.cwd(),
      env: {
        ...process.env,
        FORGEOPS_NO_INTERACTIVE: "1",
      },
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (d) => {
      stdout += String(d);
    });
    child.stderr?.on("data", (d) => {
      stderr += String(d);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}
