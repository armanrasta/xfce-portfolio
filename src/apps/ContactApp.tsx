import { useState } from "react";
import { portfolio } from "../content/portfolio";
import "./apps.css";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function ContactApp() {
  const { contact, blurb } = portfolio;
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    const ok = await copyText(value);
    setCopied(ok ? label : null);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div className="app contact-app contact-cards">
      <div className="contact-hero">
        <h2>{portfolio.name}</h2>
        <p className="about-role">{portfolio.title}</p>
        <p>{blurb}</p>
        <p className="muted">{contact.location}</p>
      </div>
      <div className="contact-grid">
        <a className="contact-card" href={`mailto:${contact.email}`}>
          <span>Email</span>
          <strong>{contact.email}</strong>
        </a>
        <button
          type="button"
          className="contact-card"
          onClick={() => copy("email", contact.email)}
        >
          <span>Copy email</span>
          <strong>{copied === "email" ? "Copied" : "Clipboard"}</strong>
        </button>
        <a className="contact-card" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
          <span>Phone</span>
          <strong>{contact.phone}</strong>
        </a>
        <button
          type="button"
          className="contact-card"
          onClick={() => copy("phone", contact.phone)}
        >
          <span>Copy phone</span>
          <strong>{copied === "phone" ? "Copied" : "Clipboard"}</strong>
        </button>
        <a
          className="contact-card"
          href={contact.github}
          target="_blank"
          rel="noreferrer"
        >
          <span>GitHub</span>
          <strong>armanrasta</strong>
        </a>
        <a
          className="contact-card"
          href={contact.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          <span>LinkedIn</span>
          <strong>arman--rostami</strong>
        </a>
      </div>
    </div>
  );
}
