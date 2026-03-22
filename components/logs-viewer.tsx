"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getServiceLogsAction } from "@/app/actions/observe";

export function LogsViewer({
  serviceName,
  initialText,
  initialSource,
  initialError,
}: {
  serviceName: string;
  initialText: string;
  initialSource: string;
  initialError?: string;
}) {
  const [text, setText] = useState(initialText);
  const [source, setSource] = useState(initialSource);
  const [err, setErr] = useState(initialError ?? "");
  const [live, setLive] = useState(false);
  const [pending, startTransition] = useTransition();
  const enc = encodeURIComponent(serviceName);
  const bottomRef = useRef<HTMLDivElement>(null);

  function refresh() {
    startTransition(async () => {
      try {
        const r = await getServiceLogsAction(serviceName);
        setText(r.text);
        setSource(r.source);
        setErr(r.error ?? "");
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    });
  }

  useEffect(() => {
    if (!live) return;
    const t = setInterval(async () => {
      try {
        const res = await fetch(`/api/services/${enc}/logs`, { cache: "no-store" });
        const r = (await res.json()) as {
          text: string;
          source: string;
          error?: string;
        };
        setText(r.text);
        setSource(r.source);
        setErr(r.error ?? "");
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    }, 4000);
    return () => clearInterval(t);
  }, [live, enc]);

  useEffect(() => {
    if (live) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [text, live]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={refresh}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600"
        >
          Refresh
        </button>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} />
          Stream (poll every 4s)
        </label>
        <span className="text-xs text-zinc-500">Source: {source}</span>
      </div>
      {err ? (
        <p className="text-sm text-amber-800 dark:text-amber-200">{err}</p>
      ) : null}
      <pre className="max-h-[32rem] overflow-auto rounded-lg border border-zinc-200 bg-zinc-950 p-4 text-xs text-zinc-100 dark:border-zinc-800">
        {text || "—"}
        <div ref={bottomRef} />
      </pre>
    </div>
  );
}
