import { portfolio } from "../content/portfolio";
import { useSession } from "../session/SessionContext";
import "./apps.css";

export function ShowcaseApp() {
  const { openApp } = useSession();
  const s = portfolio.showcase;

  return (
    <div className="app showcase-app">
      <header className="showcase-hero">
        <p className="id-kicker">Work showcase</p>
        <h2>{s.title}</h2>
        <p>{portfolio.blurb}</p>
      </header>

      <div className="showcase-metrics">
        <div>
          <strong>{s.metric}</strong>
          <span>NeoSafe production</span>
        </div>
        <div>
          <strong>{s.latency}</strong>
          <span>End-to-end path</span>
        </div>
        <div>
          <strong>OpenCV 5.x</strong>
          <span>Upstream contribution</span>
        </div>
      </div>

      <div className="arch">
        <div className="arch-box">Cameras</div>
        <span className="arch-arrow">→</span>
        <div className="arch-box">Pulsar</div>
        <span className="arch-arrow">→</span>
        <div className="arch-box">YOLO / OpenCV</div>
        <span className="arch-arrow">→</span>
        <div className="arch-box">FastAPI · K8s</div>
        <span className="arch-arrow">→</span>
        <div className="arch-box">Operator alert</div>
      </div>
      <p className="arch-note">ScyllaDB telemetry alongside the stream path</p>

      <p className="showcase-cv">{s.opencv}</p>
      <div className="tag-row">
        {s.stack.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <div className="id-actions" style={{ marginTop: 14 }}>
        <button type="button" className="xfce-btn primary" onClick={() => openApp("projects")}>
          All projects
        </button>
        <a
          className="xfce-btn"
          href="https://github.com/opencv/opencv/pull/27823"
          target="_blank"
          rel="noreferrer"
        >
          OpenCV PR #27823
        </a>
      </div>
    </div>
  );
}
