import { useState, type FormEvent } from "react";
import { portfolio } from "../content/portfolio";
import "./apps.css";

export function ContactApp() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const { contact } = portfolio;

  return (
    <div className="app contact-app">
      <div className="contact-info">
        <h2>Get in touch</h2>
        <dl>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </dd>
          <dt>Phone</dt>
          <dd>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
          </dd>
          <dt>Location</dt>
          <dd>{contact.location}</dd>
          <dt>GitHub</dt>
          <dd>
            <a href={contact.github} target="_blank" rel="noreferrer">
              {contact.github.replace(/^https?:\/\//, "")}
            </a>
          </dd>
          <dt>LinkedIn</dt>
          <dd>
            <a href={contact.linkedin} target="_blank" rel="noreferrer">
              {contact.linkedin.replace(/^https?:\/\//, "")}
            </a>
          </dd>
        </dl>
      </div>
      <form className="contact-form" onSubmit={onSubmit}>
        <label>
          Your name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Message
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="xfce-btn">
          Send (demo)
        </button>
        {sent && (
          <p className="sent-note">
            Thanks — for a real reply, email {contact.email}.
          </p>
        )}
      </form>
    </div>
  );
}
