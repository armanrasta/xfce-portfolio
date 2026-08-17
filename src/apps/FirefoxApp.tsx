import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { portfolio } from "../content/portfolio";
import "./FirefoxApp.css";

const GITHUB_USER = "armanrasta";
const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
const HOME_URL = "about:home";

type Tab = {
  id: string;
  title: string;
  url: string;
  pinned?: boolean;
};

type GhUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
};

type GhRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
};

function normalizeUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return HOME_URL;
  if (t === "about:home" || t === "about:newtab") return HOME_URL;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("github.com") || t.startsWith("www.github.com")) {
    return `https://${t.replace(/^www\./, "")}`;
  }
  if (/^[a-z0-9-]+\.[a-z]{2,}/i.test(t) || t.includes("/")) {
    return `https://${t}`;
  }
  return `https://duckduckgo.com/?q=${encodeURIComponent(t)}`;
}

function displayUrl(url: string): string {
  if (url === HOME_URL) return "";
  return url.replace(/^https:\/\//, "");
}

function tabTitle(url: string): string {
  if (url === HOME_URL) return "New Tab";
  if (url.includes("github.com")) {
    const path = url.replace(/^https?:\/\/(www\.)?github\.com\/?/, "");
    return path ? `GitHub · ${path}` : "GitHub";
  }
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function isGithub(url: string): boolean {
  return /github\.com(\/|$)/i.test(url);
}

function GithubMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 4.77c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

function NewTabPage({ onOpen }: { onOpen: (url: string) => void }) {
  const pinned = [
    {
      title: "armanrasta",
      subtitle: "GitHub · pinned",
      url: GITHUB_URL,
      kind: "github" as const,
    },
  ];
  const suggested = [
    { title: "GitHub", subtitle: "github.com", url: "https://github.com" },
    {
      title: "LinkedIn",
      subtitle: "www.linkedin.com/in/arman--rostami",
      url: portfolio.contact.linkedin,
    },
    {
      title: "OpenCV PR",
      subtitle: "PR #27823",
      url: "https://github.com/opencv/opencv/pull/27823",
    },
  ];

  return (
    <div className="ff-home">
      <div className="ff-home-wordmark">Firefox</div>
      <form
        className="ff-home-search"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new FormData(e.currentTarget).get("q") as string;
          if (q?.trim()) onOpen(normalizeUrl(q));
        }}
      >
        <span className="ff-search-icon" aria-hidden>
          ⌕
        </span>
        <input
          name="q"
          placeholder="Search or enter address"
          autoComplete="off"
        />
      </form>

      <h3 className="ff-home-label">Pinned</h3>
      <div className="ff-tiles">
        {pinned.map((t) => (
          <button
            key={t.url}
            type="button"
            className="ff-tile ff-tile-pinned"
            onClick={() => onOpen(t.url)}
          >
            <span className="ff-tile-icon ff-tile-gh">
              <GithubMark size={28} />
            </span>
            <span className="ff-tile-title">{t.title}</span>
            <span className="ff-tile-sub">{t.subtitle}</span>
          </button>
        ))}
      </div>

      <h3 className="ff-home-label">Suggested</h3>
      <div className="ff-tiles">
        {suggested.map((t) => (
          <button
            key={t.url}
            type="button"
            className="ff-tile"
            onClick={() => onOpen(t.url)}
          >
            <span className="ff-tile-icon">
              {t.title === "GitHub" ? <GithubMark size={22} /> : t.title[0]}
            </span>
            <span className="ff-tile-title">{t.title}</span>
            <span className="ff-tile-sub">{t.subtitle}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GitHubPage({ url }: { url: string }) {
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`).then((r) => {
        if (!r.ok) throw new Error(`GitHub ${r.status}`);
        return r.json() as Promise<GhUser>;
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`,
      ).then((r) => {
        if (!r.ok) throw new Error(`GitHub ${r.status}`);
        return r.json() as Promise<GhRepo[]>;
      }),
    ])
      .then(([u, r]) => {
        if (cancelled) return;
        setUser(u);
        setRepos(r.filter((repo) => !repo.fork));
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="gh-page gh-loading">
        <div className="gh-spinner" />
        Loading github.com/{GITHUB_USER}…
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="gh-page gh-fallback">
        <GithubMark size={48} />
        <h2>github.com/{GITHUB_USER}</h2>
        <p>
          GitHub doesn’t allow embedding in other sites. Open the profile in a
          real tab:
        </p>
        <a className="ff-btn primary" href={GITHUB_URL} target="_blank" rel="noreferrer">
          Open {GITHUB_USER} on GitHub
        </a>
      </div>
    );
  }

  return (
    <div className="gh-page">
      <aside className="gh-sidebar">
        <img className="gh-avatar" src={user.avatar_url} alt="" />
        <h1 className="gh-name">{user.name ?? user.login}</h1>
        <p className="gh-login">{user.login}</p>
        {user.bio && <p className="gh-bio">{user.bio}</p>}
        <a className="ff-btn primary gh-follow" href={user.html_url} target="_blank" rel="noreferrer">
          Follow on GitHub
        </a>
        <ul className="gh-meta">
          <li>
            <strong>{user.followers}</strong> followers ·{" "}
            <strong>{user.following}</strong> following
          </li>
          {user.company && <li>{user.company}</li>}
          {user.location && <li>{user.location}</li>}
          {user.blog && (
            <li>
              <a href={user.blog} target="_blank" rel="noreferrer">
                {user.blog.replace(/^https?:\/\//, "")}
              </a>
            </li>
          )}
        </ul>
      </aside>
      <section className="gh-main">
        <div className="gh-tabs">
          <span className="gh-tab active">
            Repositories <em>{user.public_repos}</em>
          </span>
        </div>
        <ul className="gh-repos">
          {repos.map((repo) => (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                {repo.name}
              </a>
              {repo.description && <p>{repo.description}</p>}
              <div className="gh-repo-meta">
                {repo.language && (
                  <span>
                    <i className="gh-lang" /> {repo.language}
                  </span>
                )}
                <span>★ {repo.stargazers_count}</span>
                <span>
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function WebFrame({ url }: { url: string }) {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    setBlocked(false);
    const t = window.setTimeout(() => setBlocked(true), 1800);
    return () => clearTimeout(t);
  }, [url]);

  return (
    <div className="ff-frame-wrap">
      <iframe
        className="ff-iframe"
        src={url}
        title={url}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onLoad={() => setBlocked(false)}
      />
      {blocked && (
        <div className="ff-blocked">
          <p>This site won’t load inside Firefox here (embedding blocked).</p>
          <a className="ff-btn primary" href={url} target="_blank" rel="noreferrer">
            Open in a real tab
          </a>
        </div>
      )}
    </div>
  );
}

export function FirefoxApp() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "pin-gh",
      title: GITHUB_USER,
      url: GITHUB_URL,
      pinned: true,
    },
  ]);
  const [activeId, setActiveId] = useState("pin-gh");
  const [bar, setBar] = useState(displayUrl(GITHUB_URL));
  const [history, setHistory] = useState<string[]>([GITHUB_URL]);
  const [histIdx, setHistIdx] = useState(0);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  useEffect(() => {
    setBar(displayUrl(active.url));
  }, [active.url, active.id]);

  const go = useCallback(
    (raw: string, { newTab }: { newTab?: boolean } = {}) => {
      const url = normalizeUrl(raw);
      const title = tabTitle(url);

      if (newTab) {
        const id = `t-${Date.now()}`;
        setTabs((ts) => [...ts, { id, title, url }]);
        setActiveId(id);
      } else {
        setTabs((ts) =>
          ts.map((t) => (t.id === activeId ? { ...t, title, url } : t)),
        );
      }

      setHistory((h) => {
        const cut = h.slice(0, histIdx + 1);
        return [...cut, url];
      });
      setHistIdx((i) => i + 1);
    },
    [activeId, histIdx],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go(bar || HOME_URL);
  };

  const back = () => {
    if (histIdx <= 0) return;
    const i = histIdx - 1;
    setHistIdx(i);
    const url = history[i];
    setTabs((ts) =>
      ts.map((t) => (t.id === activeId ? { ...t, url, title: tabTitle(url) } : t)),
    );
  };

  const forward = () => {
    if (histIdx >= history.length - 1) return;
    const i = histIdx + 1;
    setHistIdx(i);
    const url = history[i];
    setTabs((ts) =>
      ts.map((t) => (t.id === activeId ? { ...t, url, title: tabTitle(url) } : t)),
    );
  };

  const closeTab = (id: string) => {
    setTabs((ts) => {
      const next = ts.filter((t) => t.id !== id);
      if (!next.length) {
        const home: Tab = { id: "home", title: "New Tab", url: HOME_URL };
        setActiveId(home.id);
        return [home];
      }
      if (activeId === id) setActiveId(next[next.length - 1].id);
      return next;
    });
  };

  const newTab = () => {
    const id = `t-${Date.now()}`;
    setTabs((ts) => [...ts, { id, title: "New Tab", url: HOME_URL }]);
    setActiveId(id);
  };

  const page = useMemo(() => {
    if (active.url === HOME_URL) {
      return <NewTabPage onOpen={(u) => go(u)} />;
    }
    if (isGithub(active.url)) {
      return <GitHubPage url={active.url} />;
    }
    return <WebFrame url={active.url} />;
  }, [active.url, go]);

  return (
    <div className="firefox">
      <div className="ff-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ff-tab ${t.id === activeId ? "active" : ""} ${t.pinned ? "pinned" : ""}`}
            onClick={() => setActiveId(t.id)}
            title={t.url}
          >
            {t.pinned ? (
              <GithubMark size={14} />
            ) : (
              <span className="ff-tab-title">{t.title}</span>
            )}
            {!t.pinned && (
              <span
                className="ff-tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(t.id);
                }}
              >
                ×
              </span>
            )}
          </button>
        ))}
        <button type="button" className="ff-newtab" onClick={newTab} aria-label="New tab">
          +
        </button>
      </div>

      <div className="ff-navbar">
        <button type="button" className="ff-navbtn" onClick={back} disabled={histIdx <= 0} aria-label="Back">
          ←
        </button>
        <button
          type="button"
          className="ff-navbtn"
          onClick={forward}
          disabled={histIdx >= history.length - 1}
          aria-label="Forward"
        >
          →
        </button>
        <button
          type="button"
          className="ff-navbtn"
          onClick={() => go(active.url)}
          aria-label="Reload"
        >
          ↻
        </button>
        <button type="button" className="ff-navbtn" onClick={() => go(HOME_URL)} aria-label="Home">
          ⌂
        </button>
        <form className="ff-urlbar" onSubmit={onSubmit}>
          <span className="ff-lock" aria-hidden>
            {active.url.startsWith("https") ? "🔒" : "●"}
          </span>
          <input
            value={bar}
            onChange={(e) => setBar(e.target.value)}
            placeholder="Search or enter address"
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>

      <div className="ff-bookmarks">
        <button type="button" className="ff-bm ff-bm-pin" onClick={() => go(GITHUB_URL)}>
          <GithubMark size={12} />
          armanrasta
        </button>
        <button type="button" className="ff-bm" onClick={() => go("https://github.com")}>
          GitHub
        </button>
        <button type="button" className="ff-bm" onClick={() => go(HOME_URL)}>
          Home
        </button>
      </div>

      <div className="ff-content">{page}</div>
    </div>
  );
}
