import { useEffect, useRef, useState, type FormEvent } from "react";
import { portfolio } from "../content/portfolio";
import { useSession } from "./SessionContext";
import "./LoginScreen.css";

export function LoginScreen() {
  const { setPhase } = useSession();
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    setPhase("starting");
    window.setTimeout(() => setPhase("desktop"), 800);
  };

  return (
    <div className="login">
      <div className="login-wallpaper" aria-hidden>
        <div className="login-swirl" />
      </div>
      <form className="login-card" onSubmit={submit}>
        <div className="login-debian" aria-hidden>
          <svg viewBox="0 0 48 48" width="40" height="40">
            <circle cx="24" cy="24" r="22" fill="#A80030" />
            <path
              fill="#fff"
              d="M28.5 10.2c-2.2-.4-4.5.1-6.3 1.4-2.4 1.7-3.8 4.5-3.6 7.4.1 1.8.8 3.5 2 4.9.7.8.7 1.2.2 1.9-.4.5-1 .7-1.6.6-1.4-.2-2.5-1.3-2.8-2.7-.5-2.2.2-4.5 1.8-6 1.1-1 2.5-1.6 4-1.7-2.6-2.2-6.3-2.4-9.1-.4-3.2 2.3-4.5 6.5-3.1 10.1 1.2 3.1 4 5.3 7.3 5.7 1.4.2 2.8 0 4.1-.5 1.8-.7 3.2-2.1 3.9-3.8.5-1.3.5-2.7 0-4-.4-1.1-1.2-2-2.2-2.5 1.9-.3 3.5-1.5 4.3-3.2.7-1.5.7-3.2 0-4.7-.7-1.5-2-2.6-3.6-3.1.7-.3 1.5-.4 2.3-.4 1.2 0 2.3.3 3.3.9l.8-2.4c-1.4-.8-3-1.2-4.7-1.1z"
            />
          </svg>
        </div>
        <div className="login-avatar" aria-hidden>
          <span>{portfolio.name.slice(0, 1)}</span>
        </div>
        <h1 className="login-name">{portfolio.name}</h1>
        <p className="login-host">
          {portfolio.username}@{portfolio.hostname} · Debian XFCE
        </p>
        <label className="login-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          ref={inputRef}
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="any password (or empty)"
          autoComplete="off"
        />
        <button type="submit" className="login-btn">
          Log In
        </button>
        <p className="login-hint">Shown only after Log Out</p>
      </form>
    </div>
  );
}

export function StartingSession() {
  return (
    <div className="starting">
      <div className="starting-mark" aria-hidden>
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="22" fill="#A80030" />
        </svg>
      </div>
      <div className="starting-spinner" aria-hidden />
      <p>Starting Debian XFCE session…</p>
    </div>
  );
}
