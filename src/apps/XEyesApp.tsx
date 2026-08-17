import { useEffect, useRef } from "react";
import "./XEyesApp.css";

const MAX = 18;

export function XEyesApp() {
  const left = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      for (const pupil of [left.current, right.current]) {
        if (!pupil) continue;
        const eye = pupil.parentElement;
        if (!eye) continue;
        const r = eye.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const d = Math.hypot(dx, dy) || 1;
        const scale = Math.min(1, MAX / d);
        pupil.style.transform = `translate(${dx * scale}px, ${dy * scale}px)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="xeyes" aria-hidden>
      <div className="xeyes-eye">
        <span ref={left} className="xeyes-pupil" />
      </div>
      <div className="xeyes-eye">
        <span ref={right} className="xeyes-pupil" />
      </div>
    </div>
  );
}
