import { useEffect, useRef, useState, type FormEvent } from "react";
import { portfolio } from "../content/portfolio";
import { DebianLogo } from "../desktop/AppIcon";
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
        <img className="login-swirl" src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" />
      </div>
      <form className="login-card" onSubmit={submit}>
        <div className="login-debian" aria-hidden>
          <DebianLogo size={40} />
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
        <DebianLogo size={56} />
      </div>
      <div className="starting-spinner" aria-hidden />
      <p>Starting Debian XFCE session…</p>
    </div>
  );
}
