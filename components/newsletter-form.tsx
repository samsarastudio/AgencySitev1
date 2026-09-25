"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { newsletterSchema } from "@/lib/inquiry";
export function NewsletterForm() {
  const [startedAt, setStartedAt] = useState(0),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false);
  useEffect(() => setStartedAt(Date.now()), []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p = newsletterSchema.safeParse({
      email: f.get("email"),
      consent: f.get("consent") === "on",
      website: f.get("website") || "",
      startedAt,
    });
    if (!p.success) {
      setMessage(p.error.issues[0].message);
      return;
    }
    if (
      process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED !== "true" ||
      process.env.NEXT_PUBLIC_PREVIEW === "1"
    ) {
      setMessage(
        "Newsletter signup is not connected yet. Your email has not been subscribed.",
      );
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p.data),
      });
      const data = await r.json();
      setMessage(data.message);
      setDone(r.ok);
    } catch {
      setMessage("We could not confirm your signup. Please try again later.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="newsletter-form" onSubmit={submit}>
      <p>
        Occasional notes on ideas, builds and experiments. Newsletter signup is
        available once our mailing service is connected.
      </p>
      <label className="field" htmlFor="newsletter-email">
        Email address
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <input
          name="website"
          tabIndex={-1}
          aria-label="Leave empty"
          autoComplete="off"
        />
      </div>
      <label className="check-field">
        <input type="checkbox" name="consent" required />
        <span>
          I would like to receive the newsletter. See the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </label>
      <button className="button" disabled={busy || done}>
        {busy ? "Submitting…" : done ? "Request received" : "Subscribe"} ↗
      </button>
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
