import { notFound } from "next/navigation";
import { getCachedServiceDetail } from "@/lib/get-service-detail";
import { getServiceOpsState } from "@/lib/dashboard-state";
import { TestRunnerPanel } from "@/components/test-runner-panel";

type Props = { params: Promise<{ name: string }> };

export default async function TestsPage({ params }: Props) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const data = await getCachedServiceDetail(name);
  if (!data) notFound();

  const ops = await getServiceOpsState(data.entry.name);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Testing</h2>
      <TestRunnerPanel serviceName={data.entry.name} lastTest={ops.lastTest} />
    </div>
  );
}
