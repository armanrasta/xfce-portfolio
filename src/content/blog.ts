import { marked } from "marked";
import { isPublished, parsePost, sortPosts, type BlogPost } from "./parsePost";

marked.setOptions({ gfm: true, breaks: true });

export type RenderedPost = BlogPost & { html: string };

const files = import.meta.glob("./posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const allPosts: RenderedPost[] = sortPosts(
  Object.entries(files).map(([path, raw]) => parsePost(raw, path)),
).map((post) => ({
  ...post,
  html: marked.parse(post.body, { async: false }) as string,
}));

const dev = import.meta.env.DEV;

export function getPosts(): RenderedPost[] {
  return allPosts.filter((post) => isPublished(post, dev));
}

export function getPost(slug: string): RenderedPost | undefined {
  return getPosts().find((post) => post.slug === slug);
}
