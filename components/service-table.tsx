import Link from "next/link";
import type { EnrichedService } from "@/lib/registry-read";

function StatusBadge({ status }: { status: EnrichedService["status"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
        active
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-900 dark:text-amber-200">
      missing
    </span>
  );
}

export function ServiceTable({ services }: { services: EnrichedService[] }) {
  if (!services.length) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No services in <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">~/.forgeops/registry.json</code>.
        Create one with the CLI or use{" "}
        <Link href="/services/new" className="font-medium text-zinc-900 underline dark:text-zinc-100">
          Create service
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Template</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {services.map((s) => (
            <tr key={s.name} className="bg-white dark:bg-zinc-950">
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                <Link
                  href={`/services/${encodeURIComponent(s.name)}`}
                  className="hover:underline"
                >
                  {s.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{s.template ?? "—"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={s.status} />
              </td>
              <td className="px-4 py-3 text-zinc-600 tabular-nums dark:text-zinc-400">
                {new Date(s.lastUpdated).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
