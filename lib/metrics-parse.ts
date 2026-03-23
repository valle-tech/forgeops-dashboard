export function summarizeMetricsText(text: string): {
  lineCount: number;
  requestHints: number;
  errorHints: number;
  sample: string;
} {
  const lines = text.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
  let requestHints = 0;
  let errorHints = 0;
  for (const l of lines) {
    const low = l.toLowerCase();
    if (
      low.includes("http") &&
      (low.includes("request") || low.includes("requests") || low.includes("rpc"))
    ) {
      requestHints += 1;
    }
    if (low.includes("error") || low.includes("exception") || low.includes("5xx")) {
      errorHints += 1;
    }
  }
  return {
    lineCount: lines.length,
    requestHints,
    errorHints,
    sample: text.split("\n").slice(0, 60).join("\n"),
  };
}
