"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="wrap error-page">
      <p className="eyebrow">A MOMENTARY INTERRUPTION</p>
      <h1>Let’s try that again.</h1>
      <p>Something interrupted this page. Your next step is still here.</p>
      <button className="button" onClick={reset}>
        Try again ↗
      </button>
      <p style={{ marginTop: 25 }}>
        <a href="mailto:hello@inmomentservices.com">
          hello@inmomentservices.com
        </a>
      </p>
    </section>
  );
}
