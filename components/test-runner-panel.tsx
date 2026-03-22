"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { testServiceAction } from "@/app/actions/operations";
import type { OpRecord } from "@/lib/dashboard-state";

export function TestRunnerPanel({
  serviceName,
  lastTest,
}: {
  serviceName: string;
  lastTest?: OpRecord;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [out, setOut] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setErr(null);
          setOut(null);
          startTransition(async () => {
            try {
              const text = await testServiceAction(serviceName);
              setOut(text);
              router.refresh();
            } catch (e) {
              setErr(e instanceof Error ? e.message : String(e));
              router.refresh();
            }
          });
        }}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Run tests
      </button>
      <p className="text-xs text-zinc-500">
        Executes <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">forgeops test</code> (npm / go test /
        pytest depending on language).
      </p>
      {err && (
        <pre className="max-h-56 overflow-auto rounded-lg border border-red-200 bg-red-50 p-3 text-xs dark:border-red-900 dark:bg-red-950/30">
          {err}
        </pre>
      )}
      {out && (
        <pre className="max-h-56 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          {out}
        </pre>
      )}
      <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Test status</h2>
        {!lastTest ? (
          <p className="mt-1 text-sm text-zinc-500">No test runs recorded from the dashboard yet.</p>
        ) : (
          <div className="mt-2 text-sm">
            <span
              className={
                lastTest.ok
                  ? "font-medium text-emerald-700 dark:text-emerald-400"
                  : "font-medium text-red-700 dark:text-red-400"
              }
            >
              {lastTest.ok ? "Pass" : "Fail"}
            </span>
            <span className="ml-2 text-zinc-500 tabular-nums">
              {new Date(lastTest.at).toLocaleString()}
            </span>
            {lastTest.output ? (
              <pre className="mt-2 max-h-40 overflow-auto text-xs text-zinc-600 dark:text-zinc-400">
                {lastTest.output}
              </pre>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
