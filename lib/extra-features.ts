import { writeFile } from "node:fs/promises";
import {
  appendManifestFeature,
  mergeEnvFile,
  patchManifest,
  readManifest,
  removeDoc,
  removeEnvKeys,
  removeManifestFeature,
} from "./manifest-fs";

export async function addAuthFeature(root: string, serviceName: string): Promise<void> {
  await patchManifest(root, { auth: true });
  await mergeEnvFile(root, {
    JWT_SECRET: "change-me-in-production",
    JWT_EXPIRES_IN: "1h",
  });
  const body = `# Auth (${serviceName})

JWT is enabled via environment variables:
- JWT_SECRET
- JWT_EXPIRES_IN

Add route guards / middleware in your stack for protected routes.
`;
  await writeFile(`${root}/FORGEOPS_AUTH.md`, body, "utf8");
}

export async function removeAuthFeature(root: string): Promise<void> {
  await patchManifest(root, { auth: false });
  await removeManifestFeature(root, "auth");
  await removeEnvKeys(root, ["JWT_SECRET", "JWT_EXPIRES_IN"]);
  await removeDoc(root, "FORGEOPS_AUTH.md");
}

export async function addCacheFeature(root: string, serviceName: string): Promise<void> {
  await appendManifestFeature(root, "cache");
  await mergeEnvFile(root, { REDIS_URL: "redis://localhost:6379" });
  const body = `# Cache (${serviceName})

Redis URL is available as REDIS_URL in .env. Wire your client in the service layer.
`;
  await writeFile(`${root}/FORGEOPS_CACHE.md`, body, "utf8");
}

export async function removeCacheFeature(root: string): Promise<void> {
  await removeManifestFeature(root, "cache");
  await removeEnvKeys(root, ["REDIS_URL"]);
  await removeDoc(root, "FORGEOPS_CACHE.md");
}

export async function assertServiceRoot(root: string): Promise<void> {
  await readManifest(root);
}
