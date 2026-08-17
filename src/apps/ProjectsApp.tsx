import { useEffect, useState } from "react";
import { portfolio } from "../content/portfolio";
import { useSession } from "../session/SessionContext";
import { fetchGithubRepos, type GhRepo } from "./github";
import "./apps.css";

export function ProjectsApp() {
  const { openApp } = useSession();
  const [selected, setSelected] = useState(portfolio.projects[0]?.id ?? null);
  const [repos, setRepos] = useState<GhRepo[] | null>(null);
  const [ghError, setGhError] = useState<string | null>(null);
  const project = portfolio.projects.find((p) => p.id === selected);

  useEffect(() => {
    let cancelled = false;
    fetchGithubRepos()
      .then((list) => {
        if (!cancelled) setRepos(list);
      })
      .catch((e: Error) => {
        if (!cancelled) setGhError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app projects-app">
      <aside className="projects-list">
        {portfolio.projects.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`project-item ${selected === p.id ? "selected" : ""}`}
            onClick={() => setSelected(p.id)}
          >
            <span className="project-icon" aria-hidden>
              📄
            </span>
            <span>{p.name}</span>
          </button>
        ))}
      </aside>
      <section className="project-detail">
        {project ? (
          <>
            <h2>{project.name}</h2>
            <p>{project.summary}</p>
            <div className="tag-row">
              {project.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="id-actions">
              {project.url && project.url !== "#" && (
                <a
                  className="project-link"
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open project →
                </a>
              )}
              {(project.id === "neosafe" || project.id === "opencv-tsdf") && (
                <button
                  type="button"
                  className="xfce-btn primary"
                  onClick={() => openApp("showcase")}
                >
                  Open showcase
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="muted">Select a project</p>
        )}

        <h3 className="gh-live-head">GitHub · armanrasta</h3>
        {!repos && !ghError && <p className="muted">Loading repos…</p>}
        {ghError && (
          <p className="muted">
            Could not load GitHub ({ghError}). Open Firefox — GitHub is pinned.
          </p>
        )}
        {repos && (
          <ul className="gh-live">
            {repos.map((r) => (
              <li key={r.name}>
                <a href={r.html_url} target="_blank" rel="noreferrer">
                  {r.name}
                </a>
                <span>
                  ★ {r.stargazers_count}
                  {r.language ? ` · ${r.language}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="xfce-btn" onClick={() => openApp("firefox")}>
          Open in Firefox
        </button>
      </section>
    </div>
  );
}
