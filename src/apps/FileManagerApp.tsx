import { useMemo, useState } from "react";
import { portfolio } from "../content/portfolio";
import { useSession } from "../session/SessionContext";
import { homeFs, resolvePath, type FsNode } from "./filesystem";
import "./FileManagerApp.css";

function pathJoin(base: string, name: string) {
  return `${base.replace(/\/$/, "")}/${name}`;
}

export function FileManagerApp() {
  const { openApp } = useSession();
  const root = `/home/${portfolio.username}`;
  const [path, setPath] = useState(root);
  const [selected, setSelected] = useState<string | null>(null);

  const node = useMemo(() => resolvePath(path) ?? homeFs, [path]);
  const entries = node.type === "dir" ? node.children : [];

  const crumbs = useMemo(() => {
    const parts = path.split("/").filter(Boolean);
    const items: { label: string; path: string }[] = [];
    let acc = "";
    for (const part of parts) {
      acc += `/${part}`;
      items.push({ label: part, path: acc });
    }
    return items;
  }, [path]);

  const openEntry = (entry: FsNode) => {
    const full = pathJoin(path, entry.name);
    if (entry.type === "dir") {
      setPath(full);
      setSelected(null);
      return;
    }
    if (entry.openApp) {
      openApp(entry.openApp, entry.openSlug ? { slug: entry.openSlug } : undefined);
      return;
    }
    setSelected(entry.name);
  };

  const goUp = () => {
    if (path === root) return;
    const parent = path.split("/").slice(0, -1).join("/") || "/";
    setPath(parent.startsWith(root) ? parent : root);
    setSelected(null);
  };

  const preview =
    selected && node.type === "dir"
      ? (node.children.find((c) => c.name === selected && c.type === "file") as
          | Extract<FsNode, { type: "file" }>
          | undefined)
      : undefined;

  return (
    <div className="thunar">
      <div className="thunar-toolbar">
        <button type="button" className="xfce-btn" onClick={goUp} disabled={path === root}>
          ↑ Up
        </button>
        <button
          type="button"
          className="xfce-btn"
          onClick={() => {
            setPath(root);
            setSelected(null);
          }}
        >
          Home
        </button>
        <div className="thunar-path">
          {crumbs.map((c, i) => (
            <button
              key={c.path}
              type="button"
              className="crumb"
              onClick={() => {
                setPath(c.path);
                setSelected(null);
              }}
            >
              {i > 0 && <span className="crumb-sep">/</span>}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="thunar-main">
        <div className="thunar-sidebar">
          <button type="button" className="side-item" onClick={() => setPath(root)}>
            🏠 Home
          </button>
          <button
            type="button"
            className="side-item"
            onClick={() => setPath(`${root}/Desktop`)}
          >
            🖥️ Desktop
          </button>
          <button
            type="button"
            className="side-item"
            onClick={() => setPath(`${root}/Documents`)}
          >
            📄 Documents
          </button>
          <button
            type="button"
            className="side-item"
            onClick={() => setPath(`${root}/Downloads`)}
          >
            ⬇️ Downloads
          </button>
        </div>

        <div className="thunar-view">
          <div className="thunar-grid">
            {entries.map((entry) => (
              <button
                key={entry.name}
                type="button"
                className={`thunar-entry ${selected === entry.name ? "selected" : ""}`}
                onClick={() => setSelected(entry.name)}
                onDoubleClick={() => openEntry(entry)}
              >
                <span className="thunar-glyph" aria-hidden>
                  {entry.type === "dir" ? "📁" : entry.name.endsWith(".desktop") ? "🚀" : "📄"}
                </span>
                <span className="thunar-name">{entry.name}</span>
              </button>
            ))}
            {!entries.length && (
              <p className="thunar-empty">This folder is empty</p>
            )}
          </div>
          {preview && (
            <aside className="thunar-preview">
              <h3>{preview.name}</h3>
              <pre>{preview.content}</pre>
              {preview.openApp && (
                <button
                  type="button"
                  className="xfce-btn primary"
                  onClick={() =>
                    openApp(
                      preview.openApp!,
                      preview.openSlug ? { slug: preview.openSlug } : undefined,
                    )
                  }
                >
                  Open with app
                </button>
              )}
            </aside>
          )}
        </div>
      </div>

      <div className="thunar-status">
        {entries.length} item{entries.length === 1 ? "" : "s"}
        {selected ? ` — ${selected}` : ""}
        {" — "}
        Double-click to open
      </div>
    </div>
  );
}
