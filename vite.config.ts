import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { marked } from "marked";
import {
  escapeHtml,
  formatPostDate,
  isPublished,
  parsePost,
  sortPosts,
} from "./src/content/parsePost.ts";

const SITE = "https://armanrostami.ir";

marked.setOptions({ gfm: true, breaks: true });

function loadPosts() {
  const dir = path.resolve("src/content/posts");
  if (!fs.existsSync(dir)) return [];
  const posts = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => parsePost(fs.readFileSync(path.join(dir, name), "utf8"), name));
  return sortPosts(posts).filter((post) => isPublished(post, false));
}

function pageShell(opts: {
  title: string;
  description: string;
  url: string;
  jsonLd?: unknown;
  body: string;
}): string {
  const json = opts.jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(opts.jsonLd)}</script>`
    : "";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(opts.title)}</title>
    <meta name="description" content="${escapeHtml(opts.description)}" />
    <link rel="canonical" href="${opts.url}" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${opts.url}" />
    <meta property="og:title" content="${escapeHtml(opts.title)}" />
    <meta property="og:description" content="${escapeHtml(opts.description)}" />
    <meta property="og:image" content="${SITE}/arman.png" />
    <meta name="twitter:card" content="summary" />
    ${json}
    <style>
      :root { color-scheme: light; }
      body { margin: 0; font-family: Cantarell, ui-sans-serif, system-ui, sans-serif; background: #f4f1ea; color: #1c1c1c; }
      a { color: #2a5f88; }
      header, main, footer { max-width: 42rem; margin: 0 auto; padding: 0 20px; }
      header { padding-top: 28px; padding-bottom: 8px; }
      header a { text-decoration: none; font-weight: 700; color: #152536; }
      .sub { color: #5c6570; font-size: 14px; margin: 6px 0 0; }
      article { background: #fffef8; border: 1px solid #ddd; border-radius: 6px; padding: 28px 28px 36px; margin: 16px 0 40px; line-height: 1.6; }
      article h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.2; }
      .meta { color: #5c6570; font-size: 13px; margin: 0 0 22px; }
      article h2, article h3 { line-height: 1.3; }
      pre { overflow: auto; padding: 12px 14px; background: #1a222c; color: #e8eef4; border-radius: 4px; }
      code { font-family: "Ubuntu Mono", ui-monospace, monospace; font-size: 0.92em; }
      :not(pre) > code { background: #eee; padding: 0.1em 0.35em; border-radius: 2px; }
      img { max-width: 100%; height: auto; }
      .list { list-style: none; padding: 0; margin: 16px 0 40px; }
      .list li { background: #fffef8; border: 1px solid #ddd; border-radius: 6px; margin: 0 0 12px; }
      .list a { display: block; padding: 16px 18px; text-decoration: none; color: inherit; }
      .list h2 { margin: 0 0 6px; font-size: 18px; color: #152536; }
      .list p { margin: 0; color: #445; }
      footer { padding-bottom: 40px; font-size: 13px; color: #5c6570; }
    </style>
  </head>
  <body>
    ${opts.body}
  </body>
</html>
`;
}

function blogPages(): Plugin {
  return {
    name: "blog-pages",
    apply: "build",
    writeBundle(options) {
      const outDir = options.dir ?? path.resolve("dist");
      const posts = loadPosts();
      const blogDir = path.join(outDir, "blog");
      fs.mkdirSync(blogDir, { recursive: true });

      const indexBody = `
    <header>
      <a href="/">Arman Rostami</a>
      <p class="sub">Platform Engineer · Blog</p>
    </header>
    <main>
      <ul class="list">
        ${posts
          .map(
            (post) => `
        <li>
          <a href="/blog/${encodeURIComponent(post.slug)}/">
            <h2>${escapeHtml(post.title)}</h2>
            <p class="meta">${escapeHtml(formatPostDate(post.date))}</p>
            <p>${escapeHtml(post.summary)}</p>
          </a>
        </li>`,
          )
          .join("")}
      </ul>
    </main>
    <footer><a href="/">Back to the desktop</a></footer>`;

      fs.writeFileSync(
        path.join(blogDir, "index.html"),
        pageShell({
          title: "Blog — Arman Rostami",
          description:
            "Notes by Arman Rostami, Platform Engineer and Distributed Systems Specialist.",
          url: `${SITE}/blog/`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Arman Rostami Blog",
            url: `${SITE}/blog/`,
            author: { "@type": "Person", name: "Arman Rostami", url: `${SITE}/` },
          },
          body: indexBody,
        }),
      );

      for (const post of posts) {
        const html = marked.parse(post.body, { async: false }) as string;
        const url = `${SITE}/blog/${post.slug}/`;
        const dir = path.join(blogDir, post.slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(
          path.join(dir, "index.html"),
          pageShell({
            title: `${post.title} — Arman Rostami`,
            description: post.summary || post.title,
            url,
            jsonLd: {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              datePublished: post.date || undefined,
              description: post.summary,
              url,
              image: `${SITE}/arman.png`,
              author: { "@type": "Person", name: "Arman Rostami", url: `${SITE}/` },
              mainEntityOfPage: url,
            },
            body: `
    <header>
      <a href="/">Arman Rostami</a>
      <p class="sub"><a href="/blog/">Blog</a></p>
    </header>
    <main>
      <article>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="meta">${escapeHtml(formatPostDate(post.date))}${
          post.tags.length ? ` · ${escapeHtml(post.tags.join(" · "))}` : ""
        }</p>
        ${html}
      </article>
    </main>
    <footer><a href="/blog/">All posts</a> · <a href="/#/blog/${encodeURIComponent(post.slug)}">Open on the desktop</a></footer>`,
          }),
        );
      }

      const urls = [
        ["/", "1.0"],
        ["/blog/", "0.8"],
        ...posts.map((post) => [`/blog/${post.slug}/`, "0.7"] as const),
      ];
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ([loc, priority]) => `  <url>
    <loc>${SITE}${loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), blogPages()],
  base: "/",
});
