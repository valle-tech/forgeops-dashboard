import Link from "next/link";
import { getServicesForList } from "@/app/actions/services";
import { listRecentActivities } from "@/lib/activity-log";
import { ActivityFeed } from "@/components/activity-feed";
import { TEMPLATES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, activities] = await Promise.all([getServicesForList(), listRecentActivities(35)]);
  const total = services.length;
  const active = services.filter((s) => s.status === "active").length;
  const recentServices = [...services]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Forgeops services, templates, and recent activity on this machine.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{total}</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Registered services</div>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{active}</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Active (folder present)</div>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {TEMPLATES.length}+
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Built-in templates</div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Recent services</h2>
            <Link href="/services" className="text-sm font-medium text-blue-600 dark:text-blue-400">
              All →
            </Link>
          </div>
          {recentServices.length === 0 ? (
            <p className="text-sm text-zinc-500">No services yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {recentServices.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                  <Link
                    href={`/services/${encodeURIComponent(s.name)}`}
                    className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                  >
                    {s.name}
                  </Link>
                  <span className="text-xs text-zinc-500">{s.template ?? "—"}</span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/services/new"
            className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Create service
          </Link>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Activity feed</h2>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <ActivityFeed events={activities} />
          </div>
        </div>
      </section>

      <section className="flex flex-wrap gap-3 text-sm">
        <Link href="/templates" className="text-blue-600 hover:underline dark:text-blue-400">
          Templates
        </Link>
        <Link href="/system" className="text-blue-600 hover:underline dark:text-blue-400">
          System tools
        </Link>
        <Link href="/settings" className="text-blue-600 hover:underline dark:text-blue-400">
          Settings
        </Link>
      </section>
    </div>
  );
}
