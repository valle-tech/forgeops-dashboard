import Link from "next/link";
import { getServicesForList } from "@/app/actions/services";
import { ServiceTable } from "@/components/service-table";

export default async function ServicesPage() {
  const services = await getServicesForList();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Services
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Registered services from the Forgeops CLI registry.
          </p>
        </div>
        <Link
          href="/services/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Create service
        </Link>
      </div>
      <ServiceTable services={services} />
    </div>
  );
}
