/** Parse owner/repo from common GitHub URL shapes. */
export function parseGithubRepo(repoUrl: string): { owner: string; repo: string } | null {
  const u = String(repoUrl || "").trim();
  const m = u.match(/github\.com[/:]([^/]+)\/([^/.]+?)(?:\.git)?\/?$/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}

export function githubActionsUrl(repoUrl: string): string | null {
  const p = parseGithubRepo(repoUrl);
  if (!p) return null;
  return `https://github.com/${p.owner}/${p.repo}/actions`;
}

export function githubWorkflowUrl(repoUrl: string, workflowFile = "ci.yml"): string | null {
  const p = parseGithubRepo(repoUrl);
  if (!p) return null;
  return `https://github.com/${p.owner}/${p.repo}/actions/workflows/${workflowFile}`;
}
