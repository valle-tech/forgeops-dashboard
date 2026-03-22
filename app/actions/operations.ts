"use server";

import { revalidatePath } from "next/cache";
import { runForgeops } from "@/lib/forgeops-exec";
import { recordOp } from "@/lib/dashboard-state";
import { logActivitySafe } from "@/lib/activity-log";

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
  await logActivitySafe({
    type: "deployed",
    service: serviceName,
    detail: ok ? "success" : "failed",
  });
  revalidateOps(serviceName);
  revalidatePath("/");
  if (!ok) throw new Error(output.trim() || `Deploy failed (exit ${r.code})`);
  return output;
}

export async function buildServiceAction(serviceName: string) {
  const r = await runForgeops(["build", serviceName]);
  const ok = r.code === 0;
  const output = outJoin(r);
  await recordOp(serviceName, "build", { ok, output });
  await logActivitySafe({
    type: "built",
    service: serviceName,
    detail: ok ? "success" : "failed",
  });
  revalidateOps(serviceName);
  revalidatePath("/");
  if (!ok) throw new Error(output.trim() || `Build failed (exit ${r.code})`);
  return output;
}

export async function testServiceAction(serviceName: string) {
  const r = await runForgeops(["test", serviceName]);
  const ok = r.code === 0;
  const output = outJoin(r);
  await recordOp(serviceName, "test", { ok, output });
  await logActivitySafe({
    type: "tested",
    service: serviceName,
    detail: ok ? "pass" : "fail",
  });
  revalidatePath(`/services/${encodeURIComponent(serviceName)}/tests`);
  revalidatePath(`/services/${encodeURIComponent(serviceName)}`);
  revalidatePath("/");
  if (!ok) throw new Error(output.trim() || `Tests failed (exit ${r.code})`);
  return output;
}
