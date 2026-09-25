import Link from "next/link";
import { PageHero, Cta } from "@/components/ui";
import { services } from "@/content/services";
import { meta } from "@/lib/seo";
export const metadata = meta(
  "Services & creative technology",
  "Experiential AI, interactive experiences, event software, hardware integration, prototyping and FrameFlix photo experiences.",
  "/services",
);
export default function Services() {
  return (
    <>
      <PageHero
        label="OUR CAPABILITIES"
        title="Whatever the idea needs to become real."
        description="You don’t need to arrive with a technical plan. Bring us the idea, and we’ll help choose the software, equipment and approach that fit."
      />
      <section className="wrap work-index service-grid">
        {services.map((s, i) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="service-card"
          >
            <p className="eyebrow">0{i + 1} / CAPABILITY</p>
            <h2>{s.title} ↗</h2>
            <p>{s.description}</p>
            <ul>
              {s.includes.slice(0, 3).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Link>
        ))}
      </section>
      <div className="wrap">
        <Cta />
      </div>
    </>
  );
}
