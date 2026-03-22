import type { ActivityEvent } from "@/lib/activity-log";

function describe(e: ActivityEvent): string {
  const svc = e.service ? ` · ${e.service}` : "";
  const d = e.detail ? ` — ${e.detail}` : "";
  switch (e.type) {
    case "service_created":
      return `Service created${svc}${d}`;
    case "service_deleted":
      return `Service deleted${svc}${d}`;
    case "deployed":
      return `Deployed${svc}${d}`;
    case "built":
      return `Docker build${svc}${d}`;
    case "tested":
      return `Tests${svc}${d}`;
    case "env_updated":
      return `.env updated${svc}`;
    case "forgeops_config_updated":
      return `Service config updated${svc}`;
    case "feature_added":
      return `Feature added${svc}${d}`;
    case "feature_removed":
      return `Feature removed${svc}${d}`;
    case "default_template_set":
      return `Default template set${d}`;
    default:
      return `${e.type}${svc}${d}`;
  }
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (!events.length) {
    return (
      <p className="text-sm text-zinc-500">
        No activity yet. Creating services, deploys, and config saves will show up here.
      </p>
    );
  }
  return (
    <ul className="space-y-2 text-sm">
      {events.map((e, i) => (
        <li
          key={`${e.at}-${i}`}
          className="flex flex-wrap gap-x-2 gap-y-0.5 border-b border-zinc-100 py-2 last:border-0 dark:border-zinc-800"
        >
          <time className="shrink-0 text-xs tabular-nums text-zinc-500">
            {new Date(e.at).toLocaleString()}
          </time>
          <span className="text-zinc-800 dark:text-zinc-200">{describe(e)}</span>
        </li>
      ))}
    </ul>
  );
}
