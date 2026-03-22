import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplateDetail } from "@/lib/template-catalog";
import { getDashboardDefaults } from "@/lib/user-forgeops-config";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function TemplateDetailPage({ params }: Props) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  const [detail, defaults] = await Promise.all([getTemplateDetail(id), getDashboardDefaults()]);
  if (!detail) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href="/templates"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Templates
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{detail.id}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {detail.source} · {detail.stack}
          {defaults.defaultTemplate === detail.id ? (
            <span className="ml-2 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-blue-800 dark:text-blue-300">
              current default
            </span>
          ) : null}
        </p>
        <p className="mt-2 break-all font-mono text-xs text-zinc-500">{detail.path}</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Structure (top entries)</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Directories and common config files at template root (same idea as{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">forgeops templates info</code>).
        </p>
        <div className="flex flex-wrap gap-1.5">
          {detail.topEntries.map((name) => (
            <span
              key={name}
              className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Features included</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          High-level capabilities typically scaffolded from this template (plus options you choose at create time:
          database, auth, CI, etc.).
        </p>
        <ul className="list-inside list-disc text-sm text-zinc-800 dark:text-zinc-200">
          {detail.featuresIncluded.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      {detail.readmeExcerpt ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">README excerpt</h2>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
            {detail.readmeExcerpt}
          </pre>
        </section>
      ) : null}

      <Link
        href="/templates"
        className="inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to templates
      </Link>
    </div>
  );
}
