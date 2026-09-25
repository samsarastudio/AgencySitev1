"use client";
import Image from "next/image";
import Link from "next/link";
import { useQueryState } from "@/lib/use-query-state";
import type { Article } from "@/content/articles";
import { readingTime } from "@/content/articles";
export function InsightsBrowser({ articles }: { articles: Article[] }) {
  const { values, update } = useQueryState(["q", "category", "tag"]);
  const q = values.q || "",
    category = values.category || "",
    tag = values.tag || "";
  const categories = [...new Set(articles.map((a) => a.category))];
  const selected = articles.filter(
    (a) =>
      (!category || a.category === category) &&
      (!tag || a.tags.includes(tag)) &&
      (!q ||
        [
          a.title,
          a.description,
          ...a.tags,
          ...a.sections.flatMap((s) => [
            s.heading,
            ...s.paragraphs,
            ...(s.items || []),
          ]),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())),
  );
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (category) query.set("category", category);
  if (tag) query.set("tag", tag);
  const from = "/insights" + (query.size ? "?" + query : "");
  return (
    <>
      <label htmlFor="insights-search" className="sr-only">
        Search insights
      </label>
      <input
        id="insights-search"
        type="search"
        className="search-input"
        placeholder="Search ideas, technologies and planning notes…"
        value={q}
        onChange={(e) => update("q", e.target.value, true)}
      />
      <div className="filters" aria-label="Article categories">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            className="filter"
            aria-pressed={c === "All" ? !category : category === c}
            onClick={() => update("category", c === "All" ? "" : c)}
          >
            {c}
          </button>
        ))}
        {tag && (
          <button
            className="filter"
            aria-label={`Remove tag ${tag}`}
            onClick={() => update("tag", "")}
          >
            #{tag} ×
          </button>
        )}
      </div>
      <p className="count" aria-live="polite">
        {selected.length} {selected.length === 1 ? "article" : "articles"}
      </p>
      {selected.length ? (
        <div className="insight-grid">
          {selected.map((a) => (
            <article className="insight-card" key={a.slug}>
              <Link
                href={`/insights/${a.slug}?from=${encodeURIComponent(from)}`}
              >
                <div className="article-image">
                  <Image
                    src={a.image}
                    alt={a.imageAlt}
                    fill
                    sizes="(max-width:600px) 100vw, (max-width:850px) 50vw, 33vw"
                  />
                </div>
                <p className="eyebrow">{a.category}</p>
                <h2>{a.title} ↗</h2>
                <p>{a.description}</p>
                <span className="article-meta">
                  {new Date(a.published + "T12:00:00Z").toLocaleDateString(
                    "en-CA",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    },
                  )}{" "}
                  · {readingTime(a)} min read
                </span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No matching notes yet.</h2>
          <p>Try a different term or remove a category or tag.</p>
          <button
            className="button"
            onClick={() => {
              update("q", "");
              update("category", "");
              update("tag", "");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
