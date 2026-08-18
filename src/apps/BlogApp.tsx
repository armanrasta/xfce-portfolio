import { useEffect } from "react";
import { getPosts } from "../content/blog";
import { blogHash, parseBlogLocation } from "../content/blogLocation";
import { formatPostDate } from "../content/parsePost";
import { portfolio } from "../content/portfolio";
import { useSession } from "../session/SessionContext";
import "./apps.css";

export function BlogApp() {
  const { state, setBlogSlug } = useSession();
  const posts = getPosts();
  const selected = posts.find((p) => p.slug === state.blogSlug) ?? null;

  useEffect(() => {
    const loc = parseBlogLocation(window.location);
    if (loc) setBlogSlug(loc.slug);
  }, [setBlogSlug]);

  useEffect(() => {
    const hash = blogHash(state.blogSlug);
    if (window.location.hash !== hash) {
      history.replaceState(null, "", `/${hash}`);
    }
    if (selected) {
      document.title = `${selected.title} — ${portfolio.name}`;
    } else {
      document.title = `Blog — ${portfolio.seoTitle}`;
    }
    return () => {
      document.title = portfolio.seoTitle;
    };
  }, [selected, state.blogSlug]);

  const select = (slug: string | null) => {
    setBlogSlug(slug);
  };

  return (
    <div className={`app blog-app${selected ? " has-post" : ""}`}>
      <aside className="blog-list">
        <div className="blog-list-head">Posts</div>
        {posts.length === 0 && (
          <p className="blog-empty">
            Add a Markdown file to <code>src/content/posts/</code>.
          </p>
        )}
        {posts.map((post) => (
          <button
            key={post.slug}
            type="button"
            className={`blog-item${selected?.slug === post.slug ? " selected" : ""}`}
            onClick={() => select(post.slug)}
          >
            <span className="blog-item-title">{post.title}</span>
            <span className="blog-item-meta">{formatPostDate(post.date)}</span>
          </button>
        ))}
      </aside>
      <article className="blog-detail">
        {selected ? (
          <>
            <header className="blog-detail-head">
              <button type="button" className="blog-back" onClick={() => select(null)}>
                ← Posts
              </button>
              <h2>{selected.title}</h2>
              <p className="blog-detail-meta">
                {formatPostDate(selected.date)}
                {selected.tags.length > 0 ? ` · ${selected.tags.join(" · ")}` : ""}
              </p>
            </header>
            <div
              className="blog-article"
              dangerouslySetInnerHTML={{ __html: selected.html }}
            />
          </>
        ) : (
          <div className="blog-welcome">
            <h2>Blog</h2>
            <p>
              Notes by {portfolio.name}, {portfolio.title.split("|")[0].trim()}.
            </p>
            <p className="muted">
              Pick a post, or add a Markdown file in <code>src/content/posts/</code>:
            </p>
            <pre className="blog-hint">{`---
title: My post
date: 2026-08-18
summary: One sentence for search results.
tags: platform, notes
---

Write in Markdown.`}</pre>
          </div>
        )}
      </article>
    </div>
  );
}
