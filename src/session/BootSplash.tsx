import { useEffect, useRef } from "react";
import { portfolio } from "../content/portfolio";
import { useSession } from "./SessionContext";
import "./BootSplash.css";

export function BootSplash() {
  const { setPhase } = useSession();
  const skipped = useRef(false);

  const finish = () => {
    if (skipped.current) return;
    skipped.current = true;
    setPhase("desktop");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(finish, 1800);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="boot" onClick={finish} role="presentation">
      <div className="boot-logo boot-logo-now">
        <p className="boot-who">{portfolio.name}</p>
        <span className="boot-rule" aria-hidden />
        <p className="boot-role">{portfolio.title.split("|")[0].trim()}</p>
        <p className="boot-sub">Click to enter the desktop</p>
      </div>
    </div>
  );
}
