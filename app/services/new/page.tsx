import Link from "next/link";
import { CreateServiceForm } from "@/components/create-service-form";
import { getServicesOutputDirResolved, getDashboardDefaults } from "@/lib/user-forgeops-config";
import { listAllTemplates } from "@/lib/template-catalog";
import { TEMPLATES } from "@/lib/constants";
import { inferLanguageFromTemplateId } from "@/lib/template-language";

export default async function NewServicePage() {
  const [out, defaults, allTemplates] = await Promise.all([
    getServicesOutputDirResolved(),
    getDashboardDefaults(),
    listAllTemplates(),
  ]);

  const templateOptions =
    allTemplates.length > 0
      ? allTemplates.map((t) => {
          const known = TEMPLATES.find((k) => k.id === t.id);
          return {
            id: t.id,
            label: known ? `${known.label} · ${t.source}` : `${t.id} · ${t.source}`,
            language: known?.language ?? inferLanguageFromTemplateId(t.id),
          };
        })
      : TEMPLATES.map((t) => ({
          id: t.id,
          label: t.label,
          language: t.language,
        }));

  const initialPort = defaults.defaultPort ?? 3000;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/services"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Services
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create service
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Runs <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">forgeops create service</code>{" "}
          with <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">--no-interactive</code>. Output
          directory: <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">{out}</code> (override with{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">FORGEOPS_SERVICES_OUTPUT</code> or
          settings).
        </p>
      </div>
      <CreateServiceForm
        templateOptions={templateOptions}
        initialTemplateId={defaults.defaultTemplate}
        initialPort={initialPort}
      />
    </div>
  );
}
