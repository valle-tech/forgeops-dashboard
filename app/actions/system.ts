"use server";

import { runForgeops } from "@/lib/forgeops-exec";
import { readCliPackageJson, getCliPackageRoot } from "@/lib/cli-package";

export async function getInstalledCliInfo() {
  const pkg = await readCliPackageJson();
  return {
    name: pkg.name ?? "forgeops",
    version: pkg.version ?? "unknown",
    path: getCliPackageRoot(),
  };
}

export async function runDoctorCliAction(): Promise<{
  code: number;
  stdout: string;
  stderr: string;
}> {
  return runForgeops(["doctor"]);
}

export async function runForgeopsVersionCliAction(): Promise<{
  code: number;
  stdout: string;
  stderr: string;
}> {
  return runForgeops(["--version"]);
}

export async function runUpgradeCliAction(): Promise<{
  code: number;
  stdout: string;
  stderr: string;
}> {
  return runForgeops(["upgrade"]);
}
