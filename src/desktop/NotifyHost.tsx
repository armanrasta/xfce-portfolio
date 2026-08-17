import { useEffect, useRef } from "react";
import { useSession } from "../session/SessionContext";
import "./NotifyHost.css";

const SEEN_KEY = "xfce-welcome-toasts";

export function NotifyHost() {
  const { state, pushToast, dismissToast } = useSession();
  const armed = useRef(new Set<number>());

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    pushToast("Session started", "Welcome to Debian XFCE (web edition).");
    const t = window.setTimeout(() => {
      pushToast("xfce4-notifyd", "Tip: type fortune in Terminal.");
    }, 2800);
    return () => clearTimeout(t);
  }, [pushToast]);

  useEffect(() => {
    for (const toast of state.toasts) {
      if (armed.current.has(toast.id)) continue;
      armed.current.add(toast.id);
      window.setTimeout(() => dismissToast(toast.id), 8000);
    }
  }, [state.toasts, dismissToast]);

  if (!state.toasts.length) return null;

  return (
    <div className="notify-host" aria-live="polite">
      {state.toasts.map((t) => (
        <article key={t.id} className="notify-toast">
          <button
            type="button"
            className="notify-close"
            aria-label="Dismiss"
            onClick={() => dismissToast(t.id)}
          >
            ×
          </button>
          <strong>{t.title}</strong>
          <p>{t.body}</p>
        </article>
      ))}
    </div>
  );
}
