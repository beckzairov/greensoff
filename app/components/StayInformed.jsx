"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowUpRight } from "react-icons/fi";
import useSiteCopy from "../hooks/useSiteCopy";
export default function StayInformed() {
  const copy = useSiteCopy();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function subscribe(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus(response.ok ? "success" : "failure");
      if (response.ok) setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section id="contact" className="contact-section section-space">
      <div className="section-shell contact-grid">
        <div>
          <p className="eyebrow">{copy.contactEyebrow}</p>
          <h2>{copy.contactTitle}</h2>
        </div>
        <div className="contact-form-wrap">
          <p>{copy.contactIntro}</p>
          <form onSubmit={subscribe}>
            <label htmlFor="subscriber-email">{copy.email}</label>
            <div className="email-row">
              <input
                id="subscriber-email"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy}
                aria-label={busy ? copy.submitting : copy.subscribe}
              >
                <FiArrowUpRight />
              </button>
            </div>
            <div className="form-caption">
              <span>{busy ? copy.submitting : copy.subscribe}</span>
              <p>{copy.privacy}</p>
            </div>
            <p className="form-status" role="status">
              {status ? t(`stay_informed.${status}`) : ""}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
