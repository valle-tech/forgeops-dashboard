import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Login</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        This dashboard runs on your machine and talks to the Forgeops CLI and local files. There is no separate
        Forgeops “cloud account” login wired here yet.
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Optional SSO or API auth can be added later (e.g. NextAuth) if you deploy this UI to a shared environment.
      </p>
      <Link href="/" className="inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
        ← Dashboard home
      </Link>
    </div>
  );
}
