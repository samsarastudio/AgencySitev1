"use client";
import { useQueryState } from "@/lib/use-query-state";
import { WorkCard } from "./ui";
import type { Study } from "@/content/work";
export function WorkFilter({ studies }: { studies: Study[] }) {
  const { values, update } = useQueryState(["category"]);
  const categories = ["All", ...new Set(studies.flatMap((s) => s.categories))];
  const filter = categories.includes(values.category) ? values.category : "All";
  const selected = studies.filter(
    (s) => filter === "All" || s.categories.includes(filter),
  );
  const from =
    "/work" +
    (filter === "All" ? "" : "?category=" + encodeURIComponent(filter));
  return (
    <>
      <h2 className="sr-only">Experience designs</h2>
      <div className="filters" aria-label="Filter experiences">
        {categories.map((c) => (
          <button
            className="filter"
            key={c}
            aria-pressed={filter === c}
            onClick={() => update("category", c === "All" ? "" : c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="count" aria-live="polite">
        {selected.length} {selected.length === 1 ? "experience" : "experiences"}
      </p>
      <div className="work-grid">
        {selected.map((s) => (
          <WorkCard key={s.slug} study={s} returnTo={from} />
        ))}
      </div>
    </>
  );
}
