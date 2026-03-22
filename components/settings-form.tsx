"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveGlobalSettingsAction } from "@/app/actions/settings";
import type { SettingsView } from "@/app/actions/settings";

export function SettingsForm({ initial }: { initial: SettingsView }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [defaultPort, setDefaultPort] = useState(
    initial.defaultPort != null ? String(initial.defaultPort) : "",
  );
  const [outputPath, setOutputPath] = useState(initial.servicesOutputPath ?? "");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="max-w-xl space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        setErr(null);
        setMsg(null);
        startTransition(async () => {
          try {
            await saveGlobalSettingsAction({
              githubToken: token.trim() || undefined,
              defaultPort: defaultPort.trim() || undefined,
              servicesOutputPath: outputPath.trim() || undefined,
            });
            setMsg("Saved ~/.forgeops/config.json");
            setToken("");
            router.refresh();
          } catch (er) {
            setErr(er instanceof Error ? er.message : String(er));
          }
        });
      }}
    >
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

      <div>
        <label className="mb-1 block text-sm font-medium">GitHub token</label>
        <p className="mb-2 text-xs text-zinc-500">
          Stored as <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">github.token</code> (same as{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">forgeops config set github.token</code>).
          {initial.githubTokenSet ? (
            <span className="ml-1">Current: {initial.githubTokenPreview}</span>
          ) : (
            <span className="ml-1">Not set.</span>
          )}
        </p>
        <input
          type="password"
          autoComplete="off"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_…"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <p className="mt-1 text-xs text-zinc-500">Leave empty to keep the existing token.</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Default port (dashboard hint)</label>
        <input
          type="number"
          value={defaultPort}
          onChange={(e) => setDefaultPort(e.target.value)}
          placeholder="3000"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Services output directory</label>
        <input
          value={outputPath}
          onChange={(e) => setOutputPath(e.target.value)}
          placeholder="/path/to/parent-folder"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-mono text-xs dark:border-zinc-700 dark:bg-zinc-950"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Used when creating services (unless <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">FORGEOPS_SERVICES_OUTPUT</code>{" "}
          is set). Env wins over this file.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Save settings
      </button>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Effective config (preview)</h2>
        <pre className="max-h-64 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          {initial.rawJsonPreview}
        </pre>
      </div>
    </form>
  );
}
