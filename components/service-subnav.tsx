import Link from "next/link";

const links = (enc: string) =>
  [
    { href: `/services/${enc}`, label: "Overview" },
    { href: `/services/${enc}/config`, label: "Config" },
    { href: `/services/${enc}/operations`, label: "Deploy" },
    { href: `/services/${enc}/ci`, label: "CI/CD" },
    { href: `/services/${enc}/tests`, label: "Tests" },
    { href: `/services/${enc}/logs`, label: "Logs" },
    { href: `/services/${enc}/metrics`, label: "Metrics" },
  ] as const;

export function ServiceSubnav({ serviceName }: { serviceName: string }) {
  const enc = encodeURIComponent(serviceName);
  return (
    <nav className="flex flex-wrap gap-1 border-b border-zinc-200 pb-3 dark:border-zinc-800">
      {links(enc).map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded-md px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
