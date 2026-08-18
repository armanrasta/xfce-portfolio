export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  draft: boolean;
  body: string;
};

function filenameSlug(filePath: string): string {
  const base = filePath.split(/[/\\]/).pop() ?? filePath;
  return base.replace(/\.md$/i, "");
}

function parseTags(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const inner = trimmed.replace(/^\[/, "").replace(/\]$/, "");
  return inner
    .split(",")
    .map((t) => t.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function parseValue(raw: string): string {
  return raw.trim().replace(/^["']|["']$/g, "");
}

export function parsePost(raw: string, filePath: string): BlogPost {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const slugFromFile = filenameSlug(filePath);
  if (!match) {
    const fallbackTitle = slugFromFile.replace(/-/g, " ");
    return {
      slug: slugFromFile,
      title: fallbackTitle,
      date: "",
      summary: raw.trim().slice(0, 160),
      tags: [],
      draft: false,
      body: raw,
    };
  }

  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
  }

  const draftRaw = (meta.draft ?? "").toLowerCase();
  return {
    slug: parseValue(meta.slug ?? "") || slugFromFile,
    title: parseValue(meta.title ?? "") || slugFromFile,
    date: parseValue(meta.date ?? ""),
    summary: parseValue(meta.summary ?? ""),
    tags: parseTags(meta.tags ?? ""),
    draft: draftRaw === "true" || draftRaw === "yes" || draftRaw === "1",
    body: match[2].replace(/^\r?\n/, ""),
  };
}

export function isPublished(post: BlogPost, dev: boolean): boolean {
  return dev || !post.draft;
}

export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    if (a.date === b.date) return a.title.localeCompare(b.title);
    return b.date.localeCompare(a.date);
  });
}

export function formatPostDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
