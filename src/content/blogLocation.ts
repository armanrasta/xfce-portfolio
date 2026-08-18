export type BlogLocation = {
  slug: string | null;
};

export function parseBlogLocation(loc: {
  pathname: string;
  hash: string;
}): BlogLocation | null {
  const path = loc.pathname.replace(/\/+$/, "") || "/";
  if (path === "/blog") return { slug: null };
  const pathMatch = path.match(/^\/blog\/([^/]+)$/);
  if (pathMatch) return { slug: decodeURIComponent(pathMatch[1]) };

  const hash = loc.hash.replace(/^#/, "").replace(/\/+$/, "");
  if (hash === "/blog" || hash === "blog") return { slug: null };
  const hashMatch = hash.match(/^\/?blog\/([^/]+)$/);
  if (hashMatch) return { slug: decodeURIComponent(hashMatch[1]) };

  return null;
}

export function blogHash(slug: string | null): string {
  return slug ? `#/blog/${slug}` : "#/blog";
}
