import { useEffect, useState } from "react";
import { DESKTOP_ICONS, MENU_APPS } from "./icons";
import { AppIcon, DebianLogo } from "./AppIcon";
import { useSession, type AppId } from "../session/SessionContext";
import { WindowFrame } from "../wm/WindowFrame";
import { AboutApp } from "../apps/AboutApp";
import { ProjectsApp } from "../apps/ProjectsApp";
import { ContactApp } from "../apps/ContactApp";
import { TerminalApp } from "../apps/TerminalApp";
import { FileManagerApp } from "../apps/FileManagerApp";
import { SnakeGame } from "../apps/SnakeGame";
import { FirefoxApp } from "../apps/FirefoxApp";
import { portfolio } from "../content/portfolio";
import "./Desktop.css";

function AppContent({ id }: { id: AppId }) {
  switch (id) {
    case "about":
      return <AboutApp />;
    case "projects":
      return <ProjectsApp />;
    case "contact":
      return <ContactApp />;
    case "terminal":
      return <TerminalApp />;
    case "files":
      return <FileManagerApp />;
    case "snake":
      return <SnakeGame />;
    case "firefox":
      return <FirefoxApp />;
  }
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <time className="panel-clock" dateTime={now.toISOString()}>
      {now.toLocaleString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </time>
  );
}

export function Desktop() {
  const { state, openApp, focusApp, setMenuOpen, logout, reboot } =
    useSession();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".app-menu") && !t.closest(".panel-menu-btn")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [setMenuOpen]);

  const categories = [...new Set(MENU_APPS.map((a) => a.category))];

  return (
    <div className="desktop">
      <header className="panel">
        <button
          type="button"
          className={`panel-menu-btn ${state.menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!state.menuOpen)}
          aria-expanded={state.menuOpen}
          aria-label="Applications menu"
        >
          <DebianLogo size={18} />
          <span className="panel-menu-label">Applications</span>
        </button>

        <div className="panel-launchers">
          {DESKTOP_ICONS.map((icon) => (
            <button
              key={icon.id}
              type="button"
              className="panel-launcher"
              title={icon.label}
              onClick={() => openApp(icon.id)}
            >
              <AppIcon id={icon.id} size={20} />
            </button>
          ))}
        </div>

        <div className="panel-tasks">
          {state.windows.map((win) => (
            <button
              key={win.id}
              type="button"
              className={`panel-task ${
                state.focusedId === win.id && !win.minimized ? "active" : ""
              } ${win.minimized ? "min" : ""}`}
              onClick={() => focusApp(win.id)}
            >
              <AppIcon id={win.id} size={14} />
              <span>{win.title.replace(/ — .*$/, "")}</span>
            </button>
          ))}
        </div>

        <div className="panel-tray">
          <span className="tray-pill" title="Debian XFCE">
            deb
          </span>
          <span className="tray-icon" title="Network" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path
                fill="currentColor"
                d="M1 10h2v4H1zm4-3h2v7H5zm4-3h2v10H9zm4-3h2v13h-2z"
              />
            </svg>
          </span>
          <span className="tray-icon" title="Volume" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path
                fill="currentColor"
                d="M2 6h3l4-3v10L5 10H2V6zm9.5 1.5a2.5 2.5 0 0 1 0 3l-.8-.8a1.4 1.4 0 0 0 0-1.4l.8-.8z"
              />
            </svg>
          </span>
          <Clock />
        </div>
      </header>

      {state.menuOpen && (
        <div className="app-menu" role="menu">
          <div className="app-menu-brand">
            <DebianLogo size={28} />
            <div>
              <strong>Debian XFCE</strong>
              <span>
                {portfolio.username}@{portfolio.hostname}
              </span>
            </div>
          </div>
          {categories.map((cat) => (
            <div key={cat} className="app-menu-cat">
              <div className="app-menu-header">{cat}</div>
              {MENU_APPS.filter((a) => a.category === cat).map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className="app-menu-item"
                  role="menuitem"
                  onClick={() => openApp(app.id)}
                >
                  <AppIcon id={app.id} size={28} />
                  <span className="app-menu-text">
                    <span className="app-menu-name">{app.label}</span>
                    <span className="app-menu-desc">{app.description}</span>
                  </span>
                </button>
              ))}
            </div>
          ))}
          <div className="app-menu-sep" />
          <button
            type="button"
            className="app-menu-item"
            onClick={() => logout()}
          >
            <span className="app-menu-emoji" aria-hidden>
              ⌂
            </span>
            <span className="app-menu-text">
              <span className="app-menu-name">Log Out</span>
              <span className="app-menu-desc">Return to greeter</span>
            </span>
          </button>
          <button
            type="button"
            className="app-menu-item"
            onClick={() => reboot()}
          >
            <span className="app-menu-emoji" aria-hidden>
              ↻
            </span>
            <span className="app-menu-text">
              <span className="app-menu-name">Reboot</span>
              <span className="app-menu-desc">Replay boot sequence</span>
            </span>
          </button>
        </div>
      )}

      <div className="wallpaper" aria-hidden>
        <div className="wallpaper-swirl" />
      </div>

      <div className="desktop-icons">
        {DESKTOP_ICONS.map((icon) => (
          <button
            key={icon.id}
            type="button"
            className="desk-icon"
            onClick={() => openApp(icon.id)}
            title={icon.description}
          >
            <span className="desk-icon-img">
              <AppIcon id={icon.id} size={48} />
            </span>
            <span className="desk-icon-label">{icon.label}</span>
          </button>
        ))}
      </div>

      <div className="window-layer">
        {state.windows.map((win) => (
          <WindowFrame key={win.id} win={win}>
            <AppContent id={win.id} />
          </WindowFrame>
        ))}
      </div>
    </div>
  );
}
