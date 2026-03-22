import { spawn } from "node:child_process";

export type CapturedResult = {
  code: number;
  stdout: string;
  stderr: string;
};

export function runCommand(
  cmd: string,
  args: string[],
  opts?: { cwd?: string; env?: NodeJS.ProcessEnv },
): Promise<CapturedResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: opts?.cwd,
      env: { ...process.env, ...opts?.env },
      shell: false,
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

export async function ghRunListJson(cwd: string, limit = 8): Promise<CapturedResult> {
  return runCommand(
    "gh",
    [
      "run",
      "list",
      "--workflow=ci.yml",
      `--limit=${limit}`,
      "--json",
      "databaseId,conclusion,displayTitle,status,createdAt,url,headBranch",
    ],
    { cwd },
  );
}

export async function dockerComposeLogsTail(
  cwd: string,
  serviceSlug: string,
  tail = 200,
): Promise<CapturedResult> {
  const r1 = await runCommand("docker", ["compose", "logs", "--tail", String(tail), serviceSlug], {
    cwd,
  });
  if (r1.code === 0) return r1;
  return runCommand("docker-compose", ["logs", "--tail", String(tail), serviceSlug], { cwd });
}
