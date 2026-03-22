"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createServiceAction } from "@/app/actions/services";
import { DATABASES } from "@/lib/constants";
import { inferLanguageFromTemplateId } from "@/lib/template-language";

export type TemplateOption = { id: string; label: string; language: "node" | "go" | "python" };

export function CreateServiceForm({
  templateOptions,
  initialTemplateId,
  initialPort,
}: {
  templateOptions: TemplateOption[];
  initialTemplateId: string;
  initialPort: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const firstId = templateOptions[0]?.id ?? "nestjs-clean";
  const resolvedInitial = templateOptions.some((o) => o.id === initialTemplateId)
    ? initialTemplateId
    : firstId;
  const [tpl, setTpl] = useState(resolvedInitial);
  const [lang, setLang] = useState(() => {
    const o = templateOptions.find((x) => x.id === resolvedInitial);
    return o?.language ?? inferLanguageFromTemplateId(resolvedInitial);
  });

  return (
    <form
      className="max-w-md space-y-4"
      action={(fd) => {
        setError(null);
        const name = String(fd.get("name") || "").trim();
        const template = String(fd.get("template") || tpl);
        const language = String(fd.get("language") || lang);
        const db = String(fd.get("db") || "none");
        const port = Number(fd.get("port"));
        const auth = fd.get("auth") === "on";
        if (!name) {
          setError("Name is required.");
          return;
        }
        if (!Number.isFinite(port) || port < 1 || port > 65535) {
          setError("Port must be between 1 and 65535.");
          return;
        }
        startTransition(async () => {
          try {
            await createServiceAction({
              name,
              template,
              language,
              db,
              port,
              auth,
            });
            router.push(`/services/${encodeURIComponent(name)}`);
            router.refresh();
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
          }
        });
      }}
    >
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Service name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="payments"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <p className="mt-1 text-xs text-zinc-500">Same as CLI: becomes a folder like payments-service.</p>
      </div>

      <div>
        <label htmlFor="template" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Template
        </label>
        <select
          id="template"
          name="template"
          required
          value={tpl}
          onChange={(e) => {
            const id = e.target.value;
            setTpl(id);
            const o = templateOptions.find((x) => x.id === id);
            setLang(o?.language ?? inferLanguageFromTemplateId(id));
          }}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          {templateOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="language" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Language
        </label>
        <select
          id="language"
          name="language"
          required
          value={lang}
          onChange={(e) => setLang(e.target.value as TemplateOption["language"])}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="node">node</option>
          <option value="go">go</option>
          <option value="python">python</option>
        </select>
      </div>

      <div>
        <label htmlFor="db" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Database
        </label>
        <select
          id="db"
          name="db"
          defaultValue="none"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          {DATABASES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="port" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Port
        </label>
        <input
          id="port"
          name="port"
          type="number"
          required
          min={1}
          max={65535}
          defaultValue={initialPort}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div className="flex items-center gap-2">
        <input id="auth" name="auth" type="checkbox" className="rounded border-zinc-300" />
        <label htmlFor="auth" className="text-sm text-zinc-700 dark:text-zinc-300">
          JWT auth scaffolding (--auth)
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {pending ? "Creating…" : "Create service"}
      </button>
    </form>
  );
}
