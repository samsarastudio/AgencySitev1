"use client";
import Image from "next/image";
import { useQueryState } from "@/lib/use-query-state";
const pictures = [
  ["magnet-hero-pink", "Blush photo magnet", "Magnets"],
  ["magnet-cream", "Cream photo magnet", "Magnets"],
  ["magnet-mint", "Mint photo magnet", "Magnets"],
  ["magnet-blue", "Blue photo magnet", "Magnets"],
  ["magnet-nameplate-sticker", "Event nameplate detail", "Magnets"],
  ["magnet-lineup", "The pastel colour collection", "Magnets"],
  ["booth-studio", "Ring-light DSLR booth", "Booth"],
  ["setup-instant-print", "Prints and keepsake station", "Booth"],
  ["setup-booth-magnets", "Booth and magnet display", "Booth"],
  ["stickers-hero", "Sticker Studio formats", "Stickers"],
];
export function Gallery() {
  const { values, update } = useQueryState(["category"]);
  const filter = values.category || "All";
  const selected = pictures.filter((p) => filter === "All" || p[2] === filter);
  return (
    <>
      <div className="filters" aria-label="Filter product gallery">
        {["All", "Magnets", "Booth", "Stickers"].map((c) => (
          <button
            key={c}
            className="filter"
            aria-pressed={filter === c}
            onClick={() => update("category", c === "All" ? "" : c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="count" aria-live="polite">
        {selected.length} product images
      </p>
      <div className="gallery-grid">
        {selected.map(([img, alt]) => (
          <figure key={img}>
            <Image
              src={`/images/${img}.webp`}
              alt={alt + " — FrameFlix product imagery"}
              width={800}
              height={800}
            />
            <figcaption>{alt}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
