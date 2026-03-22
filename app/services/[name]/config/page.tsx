import { notFound } from "next/navigation";
import { getCachedServiceDetail } from "@/lib/get-service-detail";
import { getServiceConfigFiles } from "@/app/actions/service-config";
import { ConfigFilesForm } from "@/components/config-files-form";

type Props = { params: Promise<{ name: string }> };

export default async function ServiceConfigPage({ params }: Props) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const data = await getCachedServiceDetail(name);
  if (!data) notFound();

  if (data.entry.status !== "active") {
    return (
      <p className="text-sm text-zinc-500">
        Service folder is missing; config files are unavailable until the path exists.
      </p>
    );
  }

  const files = await getServiceConfigFiles(data.entry.name);
  if (!files) notFound();

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        View and edit environment variables and <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">.forgeops.json</code>. Invalid JSON will be rejected.
      </p>
      <ConfigFilesForm
        serviceName={data.entry.name}
        initialEnv={files.envText}
        initialForgeops={files.forgeopsJson}
      />
    </div>
  );
}
