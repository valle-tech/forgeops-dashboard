export function inferLanguageFromTemplateId(id: string): "node" | "go" | "python" {
  const low = id.toLowerCase();
  if (low.includes("go")) return "go";
  if (low.includes("python")) return "python";
  return "node";
}
