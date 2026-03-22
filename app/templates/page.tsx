import Link from "next/link";
import { listAllTemplates } from "@/lib/template-catalog";
import { getDashboardDefaults } from "@/lib/user-forgeops-config";
import { TEMPLATES } from "@/lib/constants";
import { TemplateDefaultPicker } from "@/components/template-default-picker";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const [all, defaults] = await Promise.all([listAllTemplates(), getDashboardDefaults()]);
  const list = all.length
    ? all
    : TEMPLATES.map((t) => ({
        id: t.id,
        source: "builtin" as const,
        path: "",
      }));
  const ids = list.map((t) => t.id);
  const currentDefault = defaults.defaultTemplate;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Templates</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Built-ins ship with the CLI under <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">templates/</code>;
          custom templates live in <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">~/.forgeops/templates</code>.
        </p>
      </div>

      <TemplateDefaultPicker templateIds={ids} currentDefault={currentDefault} />

      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
            <tr>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Path</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {list.map((t) => (
              <tr key={`${t.source}-${t.id}`} className="bg-white dark:bg-zinc-950">
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {t.id}
                  {t.id === currentDefault ? (
                    <span className="ml-2 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-blue-800 dark:text-blue-300">
                      default
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{t.source}</td>
                <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-zinc-500">{t.path || "—"}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/templates/${encodeURIComponent(t.id)}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
