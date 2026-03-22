import type { GhRunRow } from "@/lib/service-observe-data";

function conclusionBadge(c: string | null) {
  const v = (c || "").toLowerCase();
  if (v === "success")
    return (
      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-800 dark:text-emerald-300">
        success
      </span>
    );
  if (v === "failure")
    return (
      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-800 dark:text-red-300">
        failure
      </span>
    );
  return (
    <span className="rounded-full bg-zinc-500/15 px-2 py-0.5 text-xs text-zinc-700 dark:text-zinc-300">
      {c || "—"}
    </span>
  );
}

export function CiPanel({
  runs,
  error,
  actionsUrl,
  workflowUrl,
}: {
  runs: GhRunRow[];
  error?: string;
  actionsUrl: string | null;
  workflowUrl: string | null;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-sm">
        {workflowUrl && (
          <a
            href={workflowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Workflow (ci.yml)
          </a>
        )}
        {actionsUrl && (
          <a
            href={actionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            All GitHub Actions
          </a>
        )}
      </div>
      {error && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          {error}
        </p>
      )}
      {!runs.length && !error ? (
        <p className="text-sm text-zinc-500">No workflow runs returned.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Branch</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Result</th>
                <th className="px-3 py-2">Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {runs.map((r) => (
                <tr key={r.databaseId} className="bg-white dark:bg-zinc-950">
                  <td className="whitespace-nowrap px-3 py-2 text-zinc-600 tabular-nums dark:text-zinc-400">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="max-w-[200px] truncate px-3 py-2">{r.displayTitle}</td>
                  <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{r.headBranch}</td>
                  <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{r.status}</td>
                  <td className="px-3 py-2">{conclusionBadge(r.conclusion)}</td>
                  <td className="px-3 py-2">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Open run
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-zinc-500">
        Pipeline data comes from <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">gh run list</code> in
        the service directory (needs a GitHub remote and auth).
      </p>
    </div>
  );
}
