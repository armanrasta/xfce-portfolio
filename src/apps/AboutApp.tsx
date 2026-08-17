import { portfolio } from "../content/portfolio";
import "./apps.css";

export function AboutApp() {
  return (
    <div className="app about-app">
      <div className="mousepad-toolbar">
        <span>File</span>
        <span>Edit</span>
        <span>Search</span>
        <span>View</span>
      </div>
      <div className="mousepad-body">
        <h2>{portfolio.name}</h2>
        <p className="about-role">{portfolio.title}</p>
        <p className="about-meta">
          {portfolio.location} · {portfolio.contact.email}
        </p>
        <p className="about-text about-scan">{portfolio.blurb}</p>
        <ul className="about-scan-jobs">
          {portfolio.experience.map((job) => (
            <li key={`${job.company}-${job.period}`}>
              <strong>
                {job.role} · {job.company}
              </strong>
              <span>
                {job.period}
              </span>
            </li>
          ))}
        </ul>

        <h3>Profile</h3>
        <pre className="about-text">{portfolio.about}</pre>

        <h3>Experience</h3>
        {portfolio.experience.map((job) => (
          <section key={`${job.company}-${job.period}`} className="about-job">
            <header>
              <strong>
                {job.role} · {job.company}
              </strong>
              <span>
                {job.period} · {job.location}
              </span>
            </header>
            <ul>
              {job.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        ))}

        <h3>Education</h3>
        <p className="about-edu">
          <strong>{portfolio.education.degree}</strong> ·{" "}
          {portfolio.education.school} ({portfolio.education.period})
          <br />
          {portfolio.education.notes}
        </p>

        <h3>Skills</h3>
        {portfolio.skillGroups.map((g) => (
          <p key={g.label} className="skill-group">
            <strong>{g.label}:</strong> {g.items.join(", ")}
          </p>
        ))}

        <h3>Languages</h3>
        <p>{portfolio.languages.join(" · ")}</p>
      </div>
      <div className="mousepad-status">UTF-8 — ~/Documents/About.txt</div>
    </div>
  );
}
