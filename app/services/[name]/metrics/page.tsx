import { notFound } from "next/navigation";
import { getCachedServiceDetail } from "@/lib/get-service-detail";
import { getServiceMetricsBundle, getServiceHealthProbe } from "@/lib/service-observe-data";
import { MetricsHealthView } from "@/components/metrics-health-view";

type Props = { params: Promise<{ name: string }> };

export default async function MetricsPage({ params }: Props) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const data = await getCachedServiceDetail(name);
  if (!data) notFound();

  const [metrics, health] = await Promise.all([
    getServiceMetricsBundle(data.entry.name),
    getServiceHealthProbe(data.entry.name),
  ]);

  return (
    <div className="space-y-4">
      <MetricsHealthView metrics={metrics} health={health} />
    </div>
  );
}
