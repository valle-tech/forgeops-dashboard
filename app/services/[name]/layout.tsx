import Link from "next/link";
import { notFound } from "next/navigation";
import { getCachedServiceDetail } from "@/lib/get-service-detail";
import { ServiceSubnav } from "@/components/service-subnav";

type Props = { children: React.ReactNode; params: Promise<{ name: string }> };

export default async function ServiceLayout({ children, params }: Props) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const data = await getCachedServiceDetail(name);
  if (!data) notFound();

  const { entry } = data;
  const port = entry.httpPort ?? entry.port;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/services"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Services
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
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
      <ServiceSubnav serviceName={entry.name} />
      {children}
    </div>
  );
}
