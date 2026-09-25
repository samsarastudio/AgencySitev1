import Link from "next/link";
import Image from "next/image";
import type { Study } from "@/content/work";
export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
export function Button({
  href,
  children,
  secondary = false,
  event,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
  event?: string;
}) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? "secondary" : ""}`}
      data-event={event}
    >
      {children}
      <Arrow />
    </Link>
  );
}
export function SectionHead({
  label,
  title,
  href,
  link = "Explore more",
}: {
  label: string;
  title: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {link} <Arrow />
        </Link>
      )}
    </div>
  );
}
export function StudyMedia({
  study,
  priority = false,
}: {
  study: Study;
  priority?: boolean;
}) {
  return (
    <div className={`study-media ${!study.image ? "diagram-media" : ""}`}>
      {study.image ? (
        <Image
          src={study.image}
          alt={study.alt || study.title}
          fill
          sizes="(max-width: 720px) 100vw, 65vw"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
        />
      ) : (
        <div className="concept-flow">
          <span className="eyebrow">{study.eyebrow}</span>
          <div>
            {study.flow.slice(0, 3).map((s, i) => (
              <span key={s}>
                <small>0{i + 1}</small>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      <span className="media-caption">
        {study.image ? "Concept visualization" : "Experience flow"}
      </span>
    </div>
  );
}
export function WorkCard({
  study,
  returnTo,
}: {
  study: Study;
  index?: number;
  returnTo?: string;
}) {
  return (
    <article className="work-card">
      <Link
        href={`/work/${study.slug}${returnTo ? "?from=" + encodeURIComponent(returnTo) : ""}`}
        aria-label={`Explore ${study.eyebrow}`}
      >
        <StudyMedia study={study} />
        <div className="work-meta">
          <span>{study.eyebrow}</span>
          <span>{study.categories.join(" / ")}</span>
        </div>
        <div className="work-title">
          <h3>{study.title}</h3>
          <Arrow />
        </div>
        <p>{study.summary}</p>
      </Link>
    </article>
  );
}
export function Cta() {
  return (
    <section className="cta-section">
      <p className="eyebrow">THE NEXT MOMENT STARTS HERE</p>
      <div>
        <h2>
          Have a strange brief?
          <br />
          Send it over.
        </h2>
        <Button href="/contact" event="start_project">
          Start a project
        </Button>
      </div>
      <p>
        Tell us what you want people to experience. We’ll help work out the
        rest.
      </p>
    </section>
  );
}
export function PageHero({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="page-hero wrap">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      {description && <p className="lead">{description}</p>}
    </section>
  );
}
