import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceDetail } from "@/app/actions/services";
import { DeleteServiceForm } from "@/components/delete-service-form";
import { FeatureManager } from "@/components/feature-manager";

type Props = { params: Promise<{ name: string }> };

export default async function ServiceDetailPage({ params }: Props) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const data = await getServiceDetail(name);
  if (!data) notFound();

  const { entry, features, configJson } = data;
  const repo = entry.repoUrl?.trim();
  const port = entry.httpPort ?? entry.port;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href="/services"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Services
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {entry.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Template <span className="font-medium text-zinc-800 dark:text-zinc-200">{entry.template ?? "—"}</span>
          {port != null && (
            <>
              {" "}
              · Port <span className="tabular-nums">{port}</span>
            </>
          )}
          {entry.status === "missing" && (
            <span className="ml-2 text-amber-700 dark:text-amber-400">· Folder missing on disk</span>
          )}
        </p>
      </div>

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
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Config</h2>
        {configJson ? (
          <pre className="max-h-80 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed dark:border-zinc-800 dark:bg-zinc-900/50">
            {configJson}
          </pre>
        ) : (
          <p className="text-sm text-zinc-500">No .forgeops.json (service path missing or unreadable).</p>
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

      <section className="space-y-2 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Danger zone</h2>
        <DeleteServiceForm serviceName={entry.name} />
      </section>
    </div>
  );
}
