import {
  useCallback,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { useSession, type WindowState } from "../session/SessionContext";
import { AppIcon } from "../desktop/AppIcon";
import "./WindowFrame.css";

type Props = {
  win: WindowState;
  children: ReactNode;
};

export function WindowFrame({ win, children }: Props) {
  const {
    state,
    focusApp,
    closeApp,
    minimizeApp,
    toggleMaximize,
    moveWindow,
  } = useSession();
  const active = state.focusedId === win.id && !win.minimized;
  const drag = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(
    null,
  );

  const onTitleDown = useCallback(
    (e: ReactMouseEvent) => {
      if (win.maximized) return;
      if ((e.target as HTMLElement).closest(".win-btn")) return;
      e.preventDefault();
      focusApp(win.id);
      drag.current = {
        ox: e.clientX,
        oy: e.clientY,
        sx: win.x,
        sy: win.y,
      };

      const onMove = (ev: MouseEvent) => {
        if (!drag.current) return;
        const dx = ev.clientX - drag.current.ox;
        const dy = ev.clientY - drag.current.oy;
        moveWindow(
          win.id,
          drag.current.sx + dx,
          Math.max(0, drag.current.sy + dy),
        );
      };
      const onUp = () => {
        drag.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [focusApp, moveWindow, win],
  );

  if (win.minimized) return null;

  const style: CSSProperties = win.maximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: win.z,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.z,
      };

  return (
    <div
      className={`win ${active ? "win-active" : ""} ${win.maximized ? "win-max" : ""}`}
      style={style}
      onMouseDown={() => focusApp(win.id)}
    >
      <div
        className="win-titlebar"
        onMouseDown={onTitleDown}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <span className="win-icon">
          <AppIcon id={win.id} size={16} />
        </span>
        <span className="win-title">{win.title}</span>
        <div className="win-controls">
          <button
            type="button"
            className="win-btn"
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              minimizeApp(win.id);
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M1 8h8" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
          <button
            type="button"
            className="win-btn"
            aria-label="Maximize"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize(win.id);
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect
                x="1.5"
                y="1.5"
                width="7"
                height="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
          </button>
          <button
            type="button"
            className="win-btn win-btn-close"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              closeApp(win.id);
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path
                d="M2 2l6 6M8 2L2 8"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}
