import { useEffect, useRef, useState } from "react";
import { useSession } from "../session/SessionContext";
import "./BootSplash.css";

const BOOT_LINES = [
  "[    0.000000] Linux version 6.12.0-debian1 (debian@buildd)",
  "[    0.000124] Command line: BOOT_IMAGE=/vmlinuz root=UUID=portfolio ro quiet",
  "[    0.214882] DMI: XFCE Portfolio / Debian GNU/Linux",
  "[    0.512001] Memory: 16384MB available",
  "[    1.002441] usbcore: registered new interface driver usbhid",
  "[    1.441002] EXT4-fs (sda1): mounted filesystem with ordered data mode",
  "[    1.880221] systemd[1]: Detected architecture x86-64",
  "[    2.120004] systemd[1]: Hostname set to <xfce-portfolio>",
  "[    2.401112] Starting lightdm.service - Light Display Manager...",
  "[    2.650000] xfce4-session[ok]: Debian XFCE desktop",
  "[    2.900000] Session ready — skipping greeter (autologin).",
];

export function BootSplash() {
  const { setPhase } = useSession();
  const [visibleCount, setVisibleCount] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const skipped = useRef(false);

  const finish = () => {
    if (skipped.current) return;
    skipped.current = true;
    setPhase("starting");
    window.setTimeout(() => setPhase("desktop"), 700);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (visibleCount >= BOOT_LINES.length) {
      const t1 = setTimeout(() => setShowLogo(true), 220);
      const t2 = setTimeout(finish, 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    const delay = visibleCount < 3 ? 70 : visibleCount < 8 ? 110 : 150;
    const t = setTimeout(() => setVisibleCount((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [visibleCount]);

  return (
    <div className="boot" onClick={finish} role="presentation">
      <div className="boot-lines">
        {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
          <div key={i} className="boot-line">
            {line}
          </div>
        ))}
        {visibleCount < BOOT_LINES.length && (
          <div className="boot-line">
            <span className="boot-cursor">█</span>
          </div>
        )}
      </div>
      {showLogo && (
        <div className="boot-logo">
          <div className="boot-debian" aria-hidden>
            <svg viewBox="0 0 64 64" width="80" height="80">
              <circle cx="32" cy="32" r="30" fill="#A80030" />
              <path
                fill="#fff"
                d="M36.5 14c-2.4-.4-5 .1-7 1.5-2.6 1.9-4.2 5-4 8.2.1 2 .9 3.9 2.2 5.4.8.9.8 1.3.2 2.1-.4.6-1.1.8-1.8.7-1.5-.2-2.8-1.4-3.1-3-.6-2.4.2-5 2-6.7 1.2-1.1 2.8-1.8 4.4-1.9-2.9-2.4-7-2.7-10.1-.4-3.5 2.5-5 7.2-3.4 11.2 1.3 3.4 4.4 5.9 8.1 6.3 1.6.2 3.1 0 4.5-.6 2-.8 3.5-2.3 4.3-4.2.6-1.4.6-3 0-4.4-.4-1.2-1.3-2.2-2.4-2.8 2.1-.3 3.9-1.7 4.8-3.5.8-1.7.8-3.5 0-5.2-.8-1.7-2.2-2.9-4-3.4.8-.3 1.7-.4 2.5-.4 1.3 0 2.5.3 3.7 1l.9-2.7c-1.6-.9-3.3-1.3-5.2-1.2zm-1.3 5.7c.7.3 1.1 1.1 1.1 1.9 0 1-.6 1.8-1.4 2.1-1 .3-2.1-.1-2.7-1-.4-.8-.3-1.8.3-2.4.6-.6 1.4-.8 2.2-.6h.5z"
              />
            </svg>
          </div>
          <div className="boot-brand">Debian</div>
          <div className="boot-sub">XFCE — starting session…</div>
        </div>
      )}
      <div className="boot-hint">Press Enter to skip</div>
    </div>
  );
}
