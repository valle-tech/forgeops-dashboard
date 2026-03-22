"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addFeatureAction, removeFeatureAction } from "@/app/actions/features";
import { MANAGEABLE_FEATURES, type ManageableFeatureId } from "@/lib/constants";

export function FeatureManager({
  serviceName,
  enabled,
}: {
  serviceName: string;
  enabled: string[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const set = new Set(enabled);

  function run(op: "add" | "remove", id: ManageableFeatureId) {
    setError(null);
    startTransition(async () => {
      try {
        if (op === "add") await addFeatureAction(serviceName, id);
        else await removeFeatureAction(serviceName, id);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {enabled.length === 0 ? (
          <span className="text-sm text-zinc-500">No optional features recorded.</span>
        ) : (
          enabled.map((f) => (
            <span
              key={f}
              className="rounded-full bg-zinc-200/80 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {f}
            </span>
          ))
        )}
      </div>
      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {MANAGEABLE_FEATURES.map((f) => {
          const on = set.has(f.id);
          return (
            <li
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-3 dark:bg-zinc-950"
            >
              <div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{f.label}</span>
                <span className="ml-2 text-xs text-zinc-500">
                  {f.cli ? "CLI add/remove feature" : "Dashboard (env + manifest)"}
                </span>
              </div>
              <button
                type="button"
                disabled={
                  pending ||
                  (!on &&
                    ((f.id === "kafka" && set.has("rabbitmq")) ||
                      (f.id === "rabbitmq" && set.has("kafka"))))
                }
                onClick={() => run(on ? "remove" : "add", f.id)}
                className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium disabled:opacity-40 dark:border-zinc-600"
              >
                {on ? "Remove" : "Add"}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-zinc-500">
        Logging, Kafka, and RabbitMQ call the same logic as{" "}
        <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">forgeops add/remove feature</code>.
        Avoid enabling both Kafka and RabbitMQ on one service.
      </p>
    </div>
  );
}
