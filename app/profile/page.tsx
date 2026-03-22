import os from "node:os";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  let username = "unknown";
  try {
    username = os.userInfo().username;
  } catch {
    /* ignore */
  }
  const host = os.hostname();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Profile</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Local process identity for this dashboard server (not a Forgeops user record).
      </p>
      <dl className="space-y-2 rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">
        <div>
          <dt className="text-xs font-medium uppercase text-zinc-500">OS user</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-100">{username}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-zinc-500">Hostname</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-100">{host}</dd>
        </div>
      </dl>
      <Link href="/" className="inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
        ← Dashboard home
      </Link>
    </div>
  );
}
