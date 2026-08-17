export type GhRepo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
};

export async function fetchGithubRepos(): Promise<GhRepo[]> {
  const r = await fetch(
    "https://api.github.com/users/armanrasta/repos?sort=updated&per_page=8",
  );
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const data = (await r.json()) as GhRepo[];
  return data.filter((repo) => !repo.fork);
}
