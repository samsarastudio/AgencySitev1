"use client";
import { useEffect, useState } from "react";
import type { SavedInquiry } from "@/lib/inquiry-store";
export function InquiryInbox({ onExpired }: { onExpired: () => void }) {
  const [items, setItems] = useState<SavedInquiry[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/inquiries", { cache: "no-store" });
      if (r.status === 401) {
        onExpired();
        return;
      }
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not open enquiries.");
      setItems(data.inquiries);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  const item = items.find((i) => i.id === selected);
  return (
    <section aria-label="Enquiries inbox">
      <div className="admin-actions">
        <h2>Enquiries ({items.length})</h2>
        <button className="filter" onClick={load} disabled={loading}>
          Refresh enquiries
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      {loading && <p role="status">Loading enquiries…</p>}
      <div className="admin-grid">
        <aside className="admin-posts">
          <label className="field">
            Find an enquiry
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          {items
            .filter((i) =>
              (i.name + " " + i.email + " " + i.company + " " + i.message)
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((i) => (
              <button
                key={i.id}
                className={
                  "admin-post " + (selected === i.id ? "selected" : "")
                }
                onClick={() => setSelected(i.id)}
              >
                <strong>{i.name}</strong>
                <span>{i.type || "Website enquiry"}</span>
                <span>{new Date(i.receivedAt).toLocaleString()}</span>
              </button>
            ))}
          {!loading && !error && !items.length && (
            <p>No enquiries yet. New submissions will appear here.</p>
          )}
        </aside>
        {item ? (
          <article className="admin-empty enquiry-detail">
            <h2>{item.name}</h2>
            <p>Received {new Date(item.receivedAt).toLocaleString()}</p>
            <dl>
              {[
                ["Email", item.email],
                ["Company", item.company],
                ["Event / experience", item.type],
                ["Date", item.date],
                ["Location", item.location],
                ["Guests", item.audience],
                ["Budget", item.budget],
                ["Package", item.package],
                ["Service", item.service],
                ["Colour", item.colour],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
            <h3>Message</h3>
            <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
              {item.message}
            </p>
            <p>Consent to respond: Yes</p>
          </article>
        ) : (
          <div className="admin-empty">
            <h2>Your next project starts here.</h2>
            <p>
              Select an enquiry to see the visitor’s message and contact
              details.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
