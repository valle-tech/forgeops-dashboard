import { getGlobalSettingsView } from "@/app/actions/settings";
import { SettingsForm } from "@/components/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const initial = await getGlobalSettingsView();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Global configuration
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Persists to <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">~/.forgeops/config.json</code>, same file used by{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">forgeops config set/get</code>.
        </p>
      </div>
      <SettingsForm initial={initial} />
    </div>
  );
}
