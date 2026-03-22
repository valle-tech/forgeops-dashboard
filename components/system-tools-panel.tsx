"use client";

import { useState, useTransition } from "react";
import {
  runDoctorCliAction,
  runForgeopsVersionCliAction,
  runUpgradeCliAction,
} from "@/app/actions/system";

export function SystemToolsPanel({
  packageVersion,
  packagePath,
}: {
  packageVersion: string;
  packagePath: string;
}) {
  const [pending, startTransition] = useTransition();
  const [doctorOut, setDoctorOut] = useState<string | null>(null);
  const [doctorCode, setDoctorCode] = useState<number | null>(null);
  const [versionOut, setVersionOut] = useState<string | null>(null);
  const [upgradeOut, setUpgradeOut] = useState<string | null>(null);
  const [upgradeCode, setUpgradeCode] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">CLI version</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Package at <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">{packagePath}</code>
        </p>
        <p className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
          {packageVersion} <span className="text-sm font-normal text-zinc-500">(package.json)</span>
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setErr(null);
            setVersionOut(null);
            startTransition(async () => {
              try {
                const r = await runForgeopsVersionCliAction();
                setVersionOut((r.stdout + r.stderr).trim() || `(exit ${r.code})`);
              } catch (e) {
                setErr(e instanceof Error ? e.message : String(e));
              }
            });
          }}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600"
        >
          Run forgeops --version
        </button>
        {versionOut && (
          <pre className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            {versionOut}
          </pre>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Doctor</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Same as <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">forgeops doctor</code> — Node,
          Docker, Compose, git, optional gh.
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setErr(null);
            setDoctorOut(null);
            setDoctorCode(null);
            startTransition(async () => {
              try {
                const r = await runDoctorCliAction();
                setDoctorOut((r.stdout + r.stderr).trim());
                setDoctorCode(r.code);
              } catch (e) {
                setErr(e instanceof Error ? e.message : String(e));
              }
            });
          }}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Run doctor
        </button>
        {doctorOut !== null && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500">
              Exit code: {doctorCode} {doctorCode === 0 ? "(all required checks passed)" : "(some checks failed)"}
            </p>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
              {doctorOut}
            </pre>
          </div>
        )}
      </section>

      <section className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
          Upgrade
        </h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Runs <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">forgeops upgrade</code> →{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">npm install -g forgeops@latest</code>. Use
          only if your global CLI is the npm package <strong>forgeops</strong>; dev checkouts are not upgraded this
          way.
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!window.confirm("Run global npm upgrade for the forgeops package?")) return;
            setErr(null);
            setUpgradeOut(null);
            setUpgradeCode(null);
            startTransition(async () => {
              try {
                const r = await runUpgradeCliAction();
                setUpgradeOut((r.stdout + r.stderr).trim() || "(no output captured)");
                setUpgradeCode(r.code);
              } catch (e) {
                setErr(e instanceof Error ? e.message : String(e));
              }
            });
          }}
          className="rounded-md bg-amber-700 px-3 py-1.5 text-sm text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500"
        >
          Run upgrade
        </button>
        {upgradeOut !== null && (
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950">
            {upgradeOut}
            {upgradeCode !== null ? `\n\n(exit ${upgradeCode})` : ""}
          </pre>
        )}
      </section>

      {err && <p className="text-sm text-red-600 dark:text-red-400">{err}</p>}
    </div>
  );
}
