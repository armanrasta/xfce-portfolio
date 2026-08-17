import { useState } from "react";
import { portfolio } from "../content/portfolio";
import "./apps.css";

export function ProjectsApp() {
  const [selected, setSelected] = useState(portfolio.projects[0]?.id ?? null);
  const project = portfolio.projects.find((p) => p.id === selected);

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
          </>
        ) : (
          <p className="muted">Select a project</p>
        )}
      </section>
    </div>
  );
}
