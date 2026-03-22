"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteServiceAction } from "@/app/actions/services";

export function DeleteServiceForm({ serviceName }: { serviceName: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!confirmOpen) {
    return (
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-zinc-950 dark:text-red-300"
      >
        Delete service…
      </button>
    );
  }

  return (
    <form
      className="space-y-3 rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-900 dark:bg-red-950/20"
      action={(fd) => {
        setError(null);
        const removeRepo = fd.get("removeRepo") === "on";
        startTransition(async () => {
          try {
            await deleteServiceAction({ name: serviceName, removeRepo });
            router.push("/services");
            router.refresh();
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
          }
        });
      }}
    >
      <p className="text-sm font-medium text-red-900 dark:text-red-200">
        Delete <strong>{serviceName}</strong>? This removes the local folder and registry entry.
      </p>
      {error && (
        <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
      )}
      <div className="flex items-center gap-2">
        <input id="removeRepo" name="removeRepo" type="checkbox" className="rounded border-zinc-300" />
        <label htmlFor="removeRepo" className="text-sm text-zinc-800 dark:text-zinc-200">
          Also delete remote repo (--remove-repo, needs <code className="text-xs">gh</code> CLI)
        </label>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setConfirmOpen(false)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {pending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </form>
  );
}
