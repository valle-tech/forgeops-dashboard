"use server";

import { revalidatePath } from "next/cache";
import { runForgeops } from "@/lib/forgeops-exec";
import { recordOp } from "@/lib/dashboard-state";

function outJoin(r: { stdout: string; stderr: string }): string {
  return [r.stdout, r.stderr].filter(Boolean).join("\n");
}

function revalidateOps(name: string) {
  const enc = encodeURIComponent(name);
  revalidatePath(`/services/${enc}/operations`);
  revalidatePath(`/services/${enc}`);
}

export async function deployServiceAction(serviceName: string) {
  const r = await runForgeops(["deploy", serviceName]);
  const ok = r.code === 0;
  const output = outJoin(r);
  await recordOp(serviceName, "deploy", { ok, output });
  revalidateOps(serviceName);
  if (!ok) throw new Error(output.trim() || `Deploy failed (exit ${r.code})`);
  return output;
}

export async function buildServiceAction(serviceName: string) {
  const r = await runForgeops(["build", serviceName]);
  const ok = r.code === 0;
  const output = outJoin(r);
  await recordOp(serviceName, "build", { ok, output });
  revalidateOps(serviceName);
  if (!ok) throw new Error(output.trim() || `Build failed (exit ${r.code})`);
  return output;
}

export async function testServiceAction(serviceName: string) {
  const r = await runForgeops(["test", serviceName]);
  const ok = r.code === 0;
  const output = outJoin(r);
  await recordOp(serviceName, "test", { ok, output });
  revalidatePath(`/services/${encodeURIComponent(serviceName)}/tests`);
  revalidatePath(`/services/${encodeURIComponent(serviceName)}`);
  if (!ok) throw new Error(output.trim() || `Tests failed (exit ${r.code})`);
  return output;
}
