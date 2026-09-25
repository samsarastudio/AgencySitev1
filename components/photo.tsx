import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui";
export function PhotoNav() {
  return (
    <nav className="photo-subnav" aria-label="Photo experiences">
      <Link href="/photo-experiences">Overview</Link>
      <Link href="/fridge-magnet-frames">Magnets</Link>
      <Link href="/stickers">Sticker Studio</Link>
      <Link href="/packages">Packages</Link>
      <Link href="/gallery">Gallery</Link>
      <a href="https://frameflix.inmomentservices.com">Visit FrameFlix ↗</a>
    </nav>
  );
}
export function Packages() {
  return (
    <div className="packages">
      {[
        {
          name: "Essential",
          quantity: "60",
          gallery: "3 months",
          copy: "For birthdays and smaller gatherings.",
          features: [
            "3 hours of active booth coverage",
            "60 guest photo frames",
            "Attendant, setup and teardown",
            "Custom frame design and basic props",
          ],
        },
        {
          name: "Premium",
          quantity: "120",
          gallery: "12 months",
          copy: "More keepsakes for a fuller celebration.",
          features: [
            "3 hours of active booth coverage",
            "120 guest photo frames",
            "Attendant and guest-flow support",
            "Custom design, QR insert and premium props",
          ],
        },
        {
          name: "Signature",
          quantity: "Custom",
          gallery: "Agreed in your quote",
          copy: "For a brief that needs its own package.",
          features: [
            "Tailored coverage and frame count",
            "Attendant-operated experience",
            "Custom design with your approval",
            "Multi-day and multi-venue options",
          ],
        },
      ].map((p, i) => (
        <article
          className={"package " + (i === 1 ? "featured" : "")}
          key={p.name}
        >
          <p className="eyebrow">
            {i === 1 ? "A LITTLE MORE OF THE MOMENT" : "FRAMEFLIX"}
          </p>
          <h2>{p.name}</h2>
          <p>{p.copy}</p>
          <p className="quantity">
            {p.quantity}{" "}
            <span style={{ fontSize: "1rem", letterSpacing: 0 }}>
              guest frames
            </span>
          </p>
          <ul>
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
            <li>Online gallery: {p.gallery}</li>
          </ul>
          <Button href={"/quote?package=" + p.name} event="photo_quote">
            Request a quote
          </Button>
        </article>
      ))}
    </div>
  );
}
export function PhotoProducts() {
  return (
    <div className="photo-products">
      {[
        [
          "magnet-hero-pink",
          "Custom fridge magnets",
          "A print, a pastel frame and a nameplate made for your event.",
          "/fridge-magnet-frames",
        ],
        [
          "booth-studio",
          "The photo experience",
          "Our DSLR booth, ring light, attendant, instant prints and digital sharing.",
          "/packages",
        ],
        [
          "stickers-hero",
          "Sticker Studio",
          "Photo stickers, cutouts and labels printed and cut on site.",
          "/stickers",
        ],
      ].map(([img, title, body, href]) => (
        <article key={href}>
          <Link href={href}>
            <Image
              src={`/images/${img}.webp`}
              alt={`FrameFlix ${title.toLowerCase()} product imagery`}
              width={800}
              height={800}
            />
            <h3>{title} ↗</h3>
            <p>{body}</p>
          </Link>
        </article>
      ))}
    </div>
  );
}
export function LocalLinks() {
  return (
    <div className="related-links">
      {["Kitchener", "Waterloo", "Cambridge", "Guelph"].map((c) => (
        <Link key={c} href={"/photo-booth-" + c.toLowerCase()}>
          {c} ↗
        </Link>
      ))}
      <Link href="/wedding-photo-booth-waterloo-region">Weddings ↗</Link>
      <Link href="/corporate-event-photo-booth-waterloo-region">
        Corporate events ↗
      </Link>
      <Link href="/birthday-photo-booth-kitchener-waterloo">Birthdays ↗</Link>
      <Link href="/live-sticker-station-kitchener-waterloo">
        Live stickers ↗
      </Link>
    </div>
  );
}
