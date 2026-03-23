import path from "node:path";
import { homedir } from "node:os";

export function getForgeopsCliBin(): string {
  const override = process.env.FORGEOPS_CLI_ROOT;
  const root = override
    ? path.resolve(override)
    : path.resolve(process.cwd(), "..", "cli");
  return path.join(root, "bin", "forgeops.js");
}

export function getServicesOutputDir(): string {
  return process.env.FORGEOPS_SERVICES_OUTPUT
    ? path.resolve(process.env.FORGEOPS_SERVICES_OUTPUT)
    : path.resolve(process.cwd(), "..");
}

export function registryFilePath(): string {
  return path.join(homedir(), ".forgeops", "registry.json");
}
