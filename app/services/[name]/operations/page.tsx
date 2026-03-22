import { notFound } from "next/navigation";
import { getCachedServiceDetail } from "@/lib/get-service-detail";
import { getServiceOpsState } from "@/lib/dashboard-state";
import { OperationsPanel } from "@/components/operations-panel";

type Props = { params: Promise<{ name: string }> };

export default async function OperationsPage({ params }: Props) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const data = await getCachedServiceDetail(name);
  if (!data) notFound();

  const ops = await getServiceOpsState(data.entry.name);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Deployment actions use the Forgeops CLI on this machine. Last results are stored in{" "}
        <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">~/.forgeops/dashboard-state.json</code>.
      </p>
      <OperationsPanel serviceName={data.entry.name} initial={ops} />
    </div>
  );
}
