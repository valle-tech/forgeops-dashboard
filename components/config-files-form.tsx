"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveServiceEnvAction, saveServiceForgeopsAction } from "@/app/actions/service-config";

type Props = {
  serviceName: string;
  initialEnv: string;
  initialForgeops: string;
};

export function ConfigFilesForm({ serviceName, initialEnv, initialForgeops }: Props) {
  const router = useRouter();
  const [env, setEnv] = useState(initialEnv);
  const [fj, setFj] = useState(initialForgeops);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      {err && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {err}
        </p>
      )}
      {msg && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          {msg}
        </p>
      )}

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setErr(null);
          setMsg(null);
          startTransition(async () => {
            try {
              await saveServiceEnvAction(serviceName, env);
              setMsg("Saved .env");
              router.refresh();
            } catch (er) {
              setErr(er instanceof Error ? er.message : String(er));
            }
          });
        }}
      >
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Environment (.env)</h2>
        <textarea
          value={env}
          onChange={(e) => setEnv(e.target.value)}
          rows={14}
          className="w-full rounded-lg border border-zinc-300 bg-white p-3 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-950"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Save .env
        </button>
      </form>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setErr(null);
          setMsg(null);
          startTransition(async () => {
            try {
              await saveServiceForgeopsAction(serviceName, fj);
              setMsg("Saved .forgeops.json");
              router.refresh();
            } catch (er) {
              setErr(er instanceof Error ? er.message : String(er));
            }
          });
        }}
      >
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Service config (.forgeops.json)</h2>
        <textarea
          value={fj}
          onChange={(e) => setFj(e.target.value)}
          rows={18}
          className="w-full rounded-lg border border-zinc-300 bg-white p-3 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-950"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Save config
        </button>
      </form>
    </div>
  );
}
