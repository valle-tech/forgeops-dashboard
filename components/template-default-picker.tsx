"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setDefaultTemplateAction } from "@/app/actions/templates";

export function TemplateDefaultPicker({
  templateIds,
  currentDefault,
}: {
  templateIds: string[];
  currentDefault: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentDefault);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div>
        <label htmlFor="def-tpl" className="mb-1 block text-xs font-medium uppercase text-zinc-500">
          Default template
        </label>
        <select
          id="def-tpl"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          {templateIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        disabled={pending || value === currentDefault}
        onClick={() => {
          setErr(null);
          startTransition(async () => {
            try {
              await setDefaultTemplateAction(value);
              router.refresh();
            } catch (e) {
              setErr(e instanceof Error ? e.message : String(e));
            }
          });
        }}
        className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Save default
      </button>
      {err && <span className="text-sm text-red-600 dark:text-red-400">{err}</span>}
      <p className="w-full text-xs text-zinc-500">
        Stored in <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">dashboard.defaultTemplate</code>. Used
        when opening Create service.
      </p>
    </div>
  );
}
