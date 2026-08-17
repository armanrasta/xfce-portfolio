import type { AppId } from "../session/SessionContext";

type Props = { id: AppId; size?: number; className?: string };

/** Adwaita / Debian-style app icons (SVG, not emoji). */
export function AppIcon({ id, size = 32, className }: Props) {
  const s = size;
  switch (id) {
    case "about":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <rect x="8" y="6" width="32" height="36" rx="2" fill="#f5f0e6" stroke="#8a7a5a" strokeWidth="1.5" />
          <rect x="12" y="12" width="24" height="2.5" rx="1" fill="#c4a574" />
          <rect x="12" y="18" width="20" height="2" rx="1" fill="#d4c4a8" />
          <rect x="12" y="24" width="22" height="2" rx="1" fill="#d4c4a8" />
          <rect x="12" y="30" width="14" height="2" rx="1" fill="#d4c4a8" />
        </svg>
      );
    case "projects":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <path d="M6 16h14l4 4h18v20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V16z" fill="#e8b84a" stroke="#a07820" strokeWidth="1.5" />
          <path d="M6 16V12a2 2 0 0 1 2-2h10l3 4H6z" fill="#f0d078" stroke="#a07820" strokeWidth="1.5" />
        </svg>
      );
    case "contact":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <rect x="6" y="12" width="36" height="26" rx="2" fill="#5b9bd5" stroke="#2a5f88" strokeWidth="1.5" />
          <path d="M6 14l18 12L42 14" fill="none" stroke="#fff" strokeWidth="2" />
          <path d="M6 36l12-10M42 36L30 26" fill="none" stroke="#2a5f88" strokeWidth="1.2" opacity="0.5" />
        </svg>
      );
    case "terminal":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <rect x="4" y="8" width="40" height="32" rx="3" fill="#2d2d2d" stroke="#111" strokeWidth="1.5" />
          <rect x="4" y="8" width="40" height="8" rx="3" fill="#3c3c3c" />
          <circle cx="10" cy="12" r="1.5" fill="#e74c3c" />
          <circle cx="16" cy="12" r="1.5" fill="#f1c40f" />
          <circle cx="22" cy="12" r="1.5" fill="#2ecc71" />
          <path d="M12 24l6 4-6 4" fill="none" stroke="#7dffa0" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 32h12" stroke="#aaa" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "files":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <path d="M6 14h14l3 4h19a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V14z" fill="#f0c040" stroke="#a08020" strokeWidth="1.5" />
          <path d="M6 18h36v-2a2 2 0 0 0-2-2H22l-3-4H8a2 2 0 0 0-2 2v6z" fill="#fad860" />
        </svg>
      );
    case "firefox":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <circle cx="24" cy="24" r="20" fill="#20123a" />
          <path
            fill="#ff7139"
            d="M24 6c-9.9 0-18 8.1-18 18 0 2.4.5 4.7 1.3 6.8C10.2 20.4 18.6 14 28.5 14c.6 0 1.2 0 1.8.1C28.2 9.4 24.4 6.4 20 6.1 21.3 6 22.6 6 24 6z"
          />
          <path
            fill="#ffd140"
            d="M39.8 16.2C36.4 12.2 31.4 9.6 25.8 9.6c-2.3 0-4.4.4-6.4 1.2 4.6 1.6 8.4 4.6 10.9 8.5 3.4 1.2 6.3 3.4 8.4 6.3.8-3 1.1-6.2 1.1-9.4z"
          />
          <circle cx="26" cy="26" r="10" fill="#0060df" />
          <circle cx="26" cy="26" r="6.5" fill="#00c8d7" />
          <path
            fill="#ff7139"
            d="M14 34c3.2 5.2 9 8.6 15.4 8.6 5.2 0 9.8-2.2 13-5.7C36.8 41 28.6 43 21 40c-2.6-1-5-2.6-7-4.6z"
          />
        </svg>
      );
    case "snake":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <rect x="4" y="4" width="40" height="40" rx="4" fill="#1a222c" stroke="#0d1218" strokeWidth="1.5" />
          <rect x="10" y="22" width="8" height="8" rx="1.5" fill="#2ecc71" />
          <rect x="18" y="22" width="8" height="8" rx="1.5" fill="#27ae60" />
          <rect x="26" y="22" width="8" height="8" rx="1.5" fill="#27ae60" />
          <rect x="26" y="14" width="8" height="8" rx="1.5" fill="#27ae60" />
          <circle cx="36" cy="18" r="4" fill="#c0392b" />
          <circle cx="12" cy="24" r="1.2" fill="#fff" />
        </svg>
      );
    case "minesweeper":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <rect x="6" y="6" width="36" height="36" rx="2" fill="#c0c0c0" stroke="#555" strokeWidth="1.5" />
          <rect x="10" y="10" width="11" height="11" fill="#c8c8c8" stroke="#fff" strokeWidth="1.2" />
          <rect x="23" y="10" width="11" height="11" fill="#bdbdbd" stroke="#7b7b7b" />
          <rect x="10" y="23" width="11" height="11" fill="#e74c3c" stroke="#7b7b7b" />
          <circle cx="15.5" cy="28.5" r="2.2" fill="#111" />
          <rect x="23" y="23" width="11" height="11" fill="#c8c8c8" stroke="#fff" strokeWidth="1.2" />
          <text x="26" y="32" fontSize="9" fontWeight="700" fill="#00f">
            1
          </text>
        </svg>
      );
    case "pong":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <rect x="4" y="8" width="40" height="32" rx="2" fill="#0d1218" stroke="#2a333c" strokeWidth="1.5" />
          <rect x="8" y="16" width="3" height="14" fill="#7dffa0" />
          <rect x="37" y="18" width="3" height="14" fill="#ff8a80" />
          <circle cx="24" cy="24" r="3" fill="#fff" />
          <path d="M24 10v28" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 3" />
        </svg>
      );
    case "settings":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <circle cx="24" cy="24" r="7" fill="#c8ccd0" stroke="#555" strokeWidth="2" />
          <path
            fill="#888"
            d="M22 6h4l1 5 4-2 3 3-2 4 5 1v4l-5 1 2 4-3 3-4-2-1 5h-4l-1-5-4 2-3-3 2-4-5-1v-4l5-1-2-4 3-3 4 2 1-5z"
          />
        </svg>
      );
    case "showcase":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <rect x="6" y="10" width="36" height="28" rx="2" fill="#1a2838" stroke="#3c7fb1" strokeWidth="1.5" />
          <path d="M10 32l8-10 6 7 6-8 8 11" fill="none" stroke="#7dffa0" strokeWidth="2" />
          <circle cx="18" cy="22" r="2" fill="#ff7139" />
        </svg>
      );
    case "xeyes":
      return (
        <svg className={className} width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <rect x="4" y="10" width="40" height="28" rx="2" fill="#c8c8c8" stroke="#555" strokeWidth="1.5" />
          <ellipse cx="17" cy="24" rx="8" ry="10" fill="#f4f4f4" stroke="#222" strokeWidth="1.4" />
          <ellipse cx="31" cy="24" rx="8" ry="10" fill="#f4f4f4" stroke="#222" strokeWidth="1.4" />
          <circle cx="19" cy="26" r="3" fill="#111" />
          <circle cx="33" cy="26" r="3" fill="#111" />
        </svg>
      );
  }
}

export function DebianLogo({ size = 20 }: { size?: number }) {
  return (
    <img
      src="/favicon.svg"
      width={size}
      height={size}
      alt=""
      draggable={false}
      className="debian-logo"
    />
  );
}
