"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track, campaignParams } from "@/lib/analytics";
import { inquirySchema } from "@/lib/inquiry";
export function InquiryForm({ photo = false }: { photo?: boolean }) {
  const [startedAt, setStartedAt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState({
    package: "",
    service: "",
    location: "",
  });
  const [emailDraft, setEmailDraft] = useState(
    "mailto:hello@inmomentservices.com",
  );
  useEffect(() => {
    setStartedAt(Date.now());
    const p = new URLSearchParams(location.search);
    setSelection({
      package: p.get("package") || "",
      service: p.get("service") || "",
      location: p.get("city") || "",
    });
  }, []);
  const configured =
    process.env.NEXT_PUBLIC_FORMS_ENABLED === "true" &&
    process.env.NEXT_PUBLIC_PREVIEW !== "1";
  const show = (text: string) => {
    setMessage(text);
    setTimeout(() => result.current?.focus(), 0);
  };
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || done) return;
    const fd = new FormData(e.currentTarget);
    const fields = Object.fromEntries(fd);
    const input = {
      ...fields,
      consent: fd.get("consent") === "on",
      startedAt,
      campaign: campaignParams(),
    };
    const parsed = inquirySchema.safeParse(input);
    if (!parsed.success) {
      const errs = Object.fromEntries(
        parsed.error.issues.map((i) => [i.path[0], i.message]),
      );
      setErrors(errs);
      show("Please check the highlighted fields.");
      return;
    }
    setErrors({});
    track("send_brief", { type: photo ? "photo" : "project" });
    const draft = `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nCompany: ${parsed.data.company}\nType: ${parsed.data.type}\nDate: ${parsed.data.date}\nLocation: ${parsed.data.location}\nAudience: ${parsed.data.audience}\nBudget: ${parsed.data.budget}\nPackage: ${parsed.data.package}\nService: ${parsed.data.service}\nColour: ${parsed.data.colour}\n\n${parsed.data.message}`;
    setEmailDraft(
      "mailto:hello@inmomentservices.com?subject=" +
        encodeURIComponent(
          photo ? "FrameFlix event inquiry" : "New project brief",
        ) +
        "&body=" +
        encodeURIComponent(draft),
    );
    if (!configured) {
      show(
        "Your email draft is ready. Nothing has been sent yet. Open the draft below, review your details and send it from your email app.",
      );
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const response = await r.json();
      if (response.errors) setErrors(response.errors);
      show(
        response.message || "We could not confirm delivery. Please email us.",
      );
      if (r.ok) {
        setDone(true);
        track("form_completed", { type: photo ? "photo" : "project" });
      }
    } catch {
      show(
        "We could not confirm delivery. Your details remain below. Please try again or email us.",
      );
    } finally {
      setBusy(false);
    }
  }
  function field(name: string, label: string, type = "text", required = false) {
    return (
      <div className="field" key={name}>
        <label htmlFor={name}>
          {label}
          {required ? " *" : ""}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          maxLength={name === "email" ? 254 : 200}
          autoComplete={
            name === "name"
              ? "name"
              : name === "email"
                ? "email"
                : name === "company"
                  ? "organization"
                  : "off"
          }
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? name + "-error" : undefined}
        />
        {errors[name] && (
          <span className="field-error" id={name + "-error"}>
            {errors[name]}
          </span>
        )}
      </div>
    );
  }
  return (
    <form
      ref={form}
      onSubmit={submit}
      onFocus={() => {
        if (!started.current) {
          started.current = true;
          track("form_started", { type: photo ? "photo" : "project" });
        }
      }}
      noValidate
    >
      <p className="form-note">
        Fields marked * are required.{" "}
        {configured
          ? "We use your details to respond to this inquiry."
          : "This form prepares an email for you to review and send. You can also email us directly."}
      </p>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-grid">
        {field("name", "Your name", "text", true)}
        {field("email", photo ? "Email" : "Work email", "email", true)}
        {field("company", "Company / organisation")}
        <label className="field" htmlFor="type">
          {photo ? "Event type" : "What are you planning?"}
          <select id="type" name="type" defaultValue="">
            <option value="">Select an option</option>
            {(photo
              ? [
                  "Wedding",
                  "Corporate event",
                  "Birthday",
                  "Graduation",
                  "Anniversary",
                  "Other",
                ]
              : [
                  "AI photobooth",
                  "Photo experience",
                  "Connected event experience",
                  "Interactive installation",
                  "Custom event software",
                  "Technical prototype",
                  "Other",
                ]
            ).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        {field("date", "Event / desired launch date", "date")}
        <label className="field" htmlFor="location">
          Event location
          <input
            id="location"
            name="location"
            value={selection.location}
            maxLength={200}
            onChange={(e) =>
              setSelection((s) => ({ ...s, location: e.target.value }))
            }
          />
        </label>
        {field("audience", "About how many guests?")}
        <label className="field" htmlFor="budget">
          Budget range (optional)
          <select id="budget" name="budget">
            <option value="">Prefer to discuss</option>
            {[
              "Under $5,000 CAD",
              "$5,000–$15,000 CAD",
              "$15,000–$30,000 CAD",
              "$30,000–$60,000 CAD",
              "$60,000+ CAD",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        {photo && (
          <>
            <label className="field" htmlFor="package">
              Package
              <select
                name="package"
                id="package"
                value={selection.package}
                onChange={(e) =>
                  setSelection((s) => ({ ...s, package: e.target.value }))
                }
              >
                <option value="">Recommend a package</option>
                {["Essential", "Premium", "Signature"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="field" htmlFor="service">
              Photo service
              <select
                name="service"
                id="service"
                value={selection.service}
                onChange={(e) =>
                  setSelection((s) => ({ ...s, service: e.target.value }))
                }
              >
                <option value="">Recommend a format</option>
                {["Magnets", "Stickers", "Both"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="field full" htmlFor="colour">
              Magnet colour
              <select id="colour" name="colour">
                <option value="">Not sure yet</option>
                {["Blush pink", "Cream", "Mint", "Baby blue", "Mixed"].map(
                  (o) => (
                    <option key={o}>{o}</option>
                  ),
                )}
              </select>
            </label>
          </>
        )}
        <div className="field full">
          <label htmlFor="message">
            {photo
              ? "Tell us about the event and your nameplate idea"
              : "Tell us what you want to make happen"}{" "}
            *
          </label>
          <textarea
            id="message"
            name="message"
            required
            minLength={20}
            maxLength={6000}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <span className="field-error" id="message-error">
              {errors.message}
            </span>
          )}
        </div>
      </div>
      <label className="check-field">
        <input
          name="consent"
          type="checkbox"
          required
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />
        <span>
          I agree that InMoment may use these details to respond to my inquiry.
          I have read the{" "}
          <Link href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy<span className="sr-only"> (opens in a new tab)</span>
          </Link>
          . *
        </span>
      </label>
      {errors.consent && (
        <p className="field-error" id="consent-error">
          {errors.consent}
        </p>
      )}
      <button className="button" disabled={busy || done}>
        {busy
          ? "Sending…"
          : done
            ? "Message sent"
            : configured
              ? photo
                ? "Request a quote"
                : "Send your message"
              : "Prepare my email"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      {message && (
        <div
          ref={result}
          tabIndex={-1}
          className="form-message"
          role={done ? "status" : "alert"}
        >
          {message}
          {!done && (
            <p style={{ marginTop: 15, marginBottom: 0 }}>
              <a
                className="text-link"
                href={emailDraft}
                data-event="email_click"
              >
                Open email draft ↗
              </a>
            </p>
          )}
        </div>
      )}
    </form>
  );
}
