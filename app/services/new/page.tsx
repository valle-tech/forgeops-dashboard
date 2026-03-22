import Link from "next/link";
import { CreateServiceForm } from "@/components/create-service-form";
import { getServicesOutputDir } from "@/lib/paths";

export default function NewServicePage() {
  const out = getServicesOutputDir();

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
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">FORGEOPS_SERVICES_OUTPUT</code>).
        </p>
      </div>
      <CreateServiceForm />
    </div>
  );
}
