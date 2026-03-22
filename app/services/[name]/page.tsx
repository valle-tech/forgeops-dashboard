import Link from "next/link";
import { getCachedServiceDetail } from "@/lib/get-service-detail";
import { DeleteServiceForm } from "@/components/delete-service-form";
import { FeatureManager } from "@/components/feature-manager";

type Props = { params: Promise<{ name: string }> };

export default async function ServiceOverviewPage({ params }: Props) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const data = await getCachedServiceDetail(name);
  if (!data) return null;

  const { entry, features, configJson } = data;
  const repo = entry.repoUrl?.trim();

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Repository</h2>
        {repo ? (
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {repo}
          </a>
        ) : (
          <p className="text-sm text-zinc-500">No repo URL in registry / manifest.</p>
        )}
      </section>

      <section className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Config snapshot</h2>
          <Link
            href={`/services/${encodeURIComponent(entry.name)}/config`}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Edit config →
          </Link>
        </div>
        {configJson ? (
          <pre className="max-h-48 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
            {configJson}
          </pre>
        ) : (
          <p className="text-sm text-zinc-500">No .forgeops.json available.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Features</h2>
        {entry.status === "active" ? (
          <FeatureManager serviceName={entry.name} enabled={features} />
        ) : (
          <p className="text-sm text-zinc-500">Restore the project folder to manage features.</p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href={`/services/${encodeURIComponent(entry.name)}/operations`}
          className="rounded-lg border border-zinc-200 p-4 text-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <div className="font-medium text-zinc-900 dark:text-zinc-100">Deploy & build</div>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Trigger forgeops deploy / build</p>
        </Link>
        <Link
          href={`/services/${encodeURIComponent(entry.name)}/ci`}
          className="rounded-lg border border-zinc-200 p-4 text-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <div className="font-medium text-zinc-900 dark:text-zinc-100">CI/CD</div>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">GitHub Actions runs & links</p>
        </Link>
        <Link
          href={`/services/${encodeURIComponent(entry.name)}/tests`}
          className="rounded-lg border border-zinc-200 p-4 text-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <div className="font-medium text-zinc-900 dark:text-zinc-100">Tests</div>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Run forgeops test</p>
        </Link>
        <Link
          href={`/services/${encodeURIComponent(entry.name)}/logs`}
          className="rounded-lg border border-zinc-200 p-4 text-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <div className="font-medium text-zinc-900 dark:text-zinc-100">Logs</div>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Compose / forgeops logs</p>
        </Link>
        <Link
          href={`/services/${encodeURIComponent(entry.name)}/metrics`}
          className="rounded-lg border border-zinc-200 p-4 text-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <div className="font-medium text-zinc-900 dark:text-zinc-100">Metrics & health</div>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Prometheus scrape + /health</p>
        </Link>
      </section>

      <section className="space-y-2 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Danger zone</h2>
        <DeleteServiceForm serviceName={entry.name} />
      </section>
    </div>
  );
}
