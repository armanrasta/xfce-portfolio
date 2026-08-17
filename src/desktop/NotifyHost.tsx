import { useEffect, useState } from "react";
import "./NotifyHost.css";

type Toast = { id: number; title: string; body: string };

const SEEN_KEY = "xfce-welcome-toasts";

export function NotifyHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");

    const t2 = window.setTimeout(() => {
      setToasts([
        {
          id: 2,
          title: "GitHub",
          body: "Pinned in Firefox — github.com/armanrasta",
        },
      ]);
    }, 9000);
    const t3 = window.setTimeout(() => setToasts([]), 15000);
    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="notify-host" aria-live="polite">
      {toasts.map((t) => (
        <article key={t.id} className="notify-toast">
          <button
            type="button"
            className="notify-close"
            aria-label="Dismiss"
            onClick={() => setToasts((cur) => cur.filter((x) => x.id !== t.id))}
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
