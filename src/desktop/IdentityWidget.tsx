import { portfolio } from "../content/portfolio";
import { useSession } from "../session/SessionContext";
import "./IdentityWidget.css";

const [firstName, ...rest] = portfolio.name.split(" ");
const lastName = rest.join(" ");
const headline = portfolio.title.split("|")[0].trim();

export function IdentityHero() {
  const { openApp } = useSession();

  return (
    <div className="id-hero">
      <h1 className="id-hero-name">
        <span>{firstName}</span>
        {lastName && <span>{lastName}</span>}
      </h1>
      <h2 className="id-hero-title">{headline}</h2>
      <p className="id-hero-blurb">{portfolio.blurb}</p>
      <p className="id-hero-aside">Runs in a browser. Pretends it&apos;s Debian.</p>
      <div className="id-hero-cta">
        <button type="button" className="id-hero-btn" onClick={() => openApp("about")}>
          About
        </button>
        <button type="button" className="id-hero-btn" onClick={() => openApp("projects")}>
          Work
        </button>
        <a className="id-hero-link" href={`mailto:${portfolio.contact.email}`}>
          Email
        </a>
        <a
          className="id-hero-link"
          href={portfolio.contact.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
      <p className="id-hero-meta">
        {portfolio.location}
        <span aria-hidden> · </span>
        {portfolio.contact.email}
      </p>
    </div>
  );
}

export function IdentityWidget() {
  const { openApp } = useSession();

  return (
    <aside className="id-widget" aria-label="Quick notes">
      <div className="id-widget-bar">Notes</div>
      <div className="id-widget-body">
        <p className="id-kicker">Also</p>
        <ul>
          {portfolio.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="id-actions">
          <button type="button" className="id-btn" onClick={() => openApp("contact")}>
            Contact
          </button>
          <button type="button" className="id-btn" onClick={() => openApp("showcase")}>
            Showcase
          </button>
        </div>
      </div>
    </aside>
  );
}
