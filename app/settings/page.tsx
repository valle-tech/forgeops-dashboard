import { getGlobalSettingsView } from "@/app/actions/settings";
import { SettingsForm } from "@/components/settings-form";
import { listAllTemplates } from "@/lib/template-catalog";
import { TEMPLATES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [initial, all] = await Promise.all([getGlobalSettingsView(), listAllTemplates()]);
  const templateIds = all.length ? all.map((t) => t.id) : TEMPLATES.map((t) => t.id);

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
      <SettingsForm initial={initial} templateIds={templateIds} />
    </div>
  );
}
