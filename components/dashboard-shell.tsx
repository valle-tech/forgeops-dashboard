import Link from "next/link";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/services/new", label: "Create service" },
  { href: "/settings", label: "Settings" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <Link href="/services" className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Forgeops
          </Link>
          <p className="mt-0.5 text-xs text-zinc-500">Service dashboard</p>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-200/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
