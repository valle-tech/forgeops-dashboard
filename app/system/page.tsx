import { getInstalledCliInfo } from "@/app/actions/system";
import { SystemToolsPanel } from "@/components/system-tools-panel";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const info = await getInstalledCliInfo();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">System tools</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Environment checks and CLI maintenance, mirroring{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">forgeops doctor</code>,{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">--version</code>, and{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">upgrade</code>.
        </p>
      </div>
      <SystemToolsPanel packageVersion={info.version} packagePath={info.path} />
    </div>
  );
}
