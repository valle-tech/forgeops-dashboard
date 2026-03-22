import { notFound } from "next/navigation";
import { getCachedServiceDetail } from "@/lib/get-service-detail";
import { getServiceLogsBundle } from "@/lib/service-observe-data";
import { LogsViewer } from "@/components/logs-viewer";

type Props = { params: Promise<{ name: string }> };

export default async function LogsPage({ params }: Props) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const data = await getCachedServiceDetail(name);
  if (!data) notFound();

  const logs =
    data.entry.status === "active"
      ? await getServiceLogsBundle(data.entry.name)
      : { text: "", source: "none" as const, error: "Service path missing" };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Logs</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Prefers <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">docker compose logs</code>; falls
        back to <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">forgeops logs --no-follow</code>.
        Enable streaming to poll the HTTP API every few seconds.
      </p>
      <LogsViewer
        serviceName={data.entry.name}
        initialText={logs.text}
        initialSource={logs.source}
        initialError={logs.error}
      />
    </div>
  );
}
