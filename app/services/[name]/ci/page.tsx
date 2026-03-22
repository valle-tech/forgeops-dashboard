import { notFound } from "next/navigation";
import { getCachedServiceDetail } from "@/lib/get-service-detail";
import { getCiRunsForService } from "@/lib/service-observe-data";
import { CiPanel } from "@/components/ci-panel";

type Props = { params: Promise<{ name: string }> };

export default async function CiPage({ params }: Props) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const data = await getCachedServiceDetail(name);
  if (!data) notFound();

  const ci = await getCiRunsForService(data.entry.name);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Pipeline status</h2>
      <CiPanel
        runs={ci.runs}
        error={ci.error}
        actionsUrl={ci.actionsUrl}
        workflowUrl={ci.workflowUrl}
      />
    </div>
  );
}
