"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deployServiceAction,
  buildServiceAction,
} from "@/app/actions/operations";
import type { OpRecord } from "@/lib/dashboard-state";

function StatusLine({ label, rec }: { label: string; rec?: OpRecord }) {
  if (!rec) {
    return (
      <p className="text-sm text-zinc-500">
        {label}: <span className="text-zinc-400">no runs yet from this dashboard</span>
      </p>
    );
  }
  return (
    <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium text-zinc-800 dark:text-zinc-200">{label}</span>
        <span
          className={
            rec.ok
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-red-700 dark:text-red-400"
          }
        >
          {rec.ok ? "success" : "failed"}
        </span>
        <span className="text-zinc-500 tabular-nums">{new Date(rec.at).toLocaleString()}</span>
      </div>
      {rec.output ? (
        <pre className="mt-2 max-h-40 overflow-auto text-xs text-zinc-600 dark:text-zinc-400">
          {rec.output}
        </pre>
      ) : null}
    </div>
  );
}

export function OperationsPanel({
  serviceName,
  initial,
}: {
  serviceName: string;
  initial: { lastDeploy?: OpRecord; lastBuild?: OpRecord; lastTest?: OpRecord };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [out, setOut] = useState<string | null>(null);

  function run(kind: "deploy" | "build") {
    setErr(null);
    setOut(null);
    startTransition(async () => {
      try {
        const text =
          kind === "deploy"
            ? await deployServiceAction(serviceName)
            : await buildServiceAction(serviceName);
        setOut(text);
        router.refresh();
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => run("deploy")}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Deploy
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run("build")}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-600"
        >
          Docker build
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        Deploy runs <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">forgeops deploy</code> (GitHub
        workflow when <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">gh</code> is available, then
        local <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">docker build</code>).
      </p>
      {err && (
        <pre className="max-h-48 overflow-auto rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          {err}
        </pre>
      )}
      {out && (
        <pre className="max-h-48 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          {out}
        </pre>
      )}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Deployment status</h2>
        <StatusLine label="Last deploy" rec={initial.lastDeploy} />
        <StatusLine label="Last build" rec={initial.lastBuild} />
      </div>
    </div>
  );
}
