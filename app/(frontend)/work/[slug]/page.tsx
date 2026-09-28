import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { notFound } from "next/navigation";
import { publishedStudies } from "@/content/work";
import { services } from "@/content/services";
import {
  PageHero,
  StudyMedia,
  Cta,
  WorkCard,
  SectionHead,
} from "@/components/ui";
import { JsonLd, meta, origin } from "@/lib/seo";
export function generateStaticParams() {
  return publishedStudies.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = publishedStudies.find((s) => s.slug === slug);
  return s ? meta(s.eyebrow, s.summary, `/work/${slug}`, s.image) : {};
}
export default async function StudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = publishedStudies.find((s) => s.slug === slug);
  if (!s) notFound();
  const related = publishedStudies
    .filter(
      (x) =>
        x.slug !== slug && x.categories.some((c) => s.categories.includes(c)),
    )
    .slice(0, 2);
  return (
    <>
      <nav className="wrap breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/work">Work</Link> /{" "}
        {s.eyebrow}
      </nav>
      <PageHero label={s.eyebrow} title={s.title} description={s.summary} />
      <div className="wrap case-hero">
        <StudyMedia study={s} priority />
        <div className="status-line">
          <span>{s.status}</span>
          <span>{s.categories.join(" / ")}</span>
        </div>
        <div className="case-body">
          <aside>
            <h2>Technology</h2>
            <ul>
              {s.technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </aside>
          <div className="case-copy">
            <section>
              <h2>The idea</h2>
              <p>{s.brief}</p>
            </section>
            <section>
              <h2>The challenge</h2>
              <p>{s.challenge}</p>
            </section>
            <section>
              <h2>What guests do</h2>
              <p>{s.experience}</p>
            </section>
            <section>
              <h2>The interaction, step by step</h2>
              <ol className="flow">
                {s.flow.map((f, i) => (
                  <li key={f}>
                    <span>0{i + 1}</span>
                    {f}
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2>What makes it work</h2>
              <p>{s.production}</p>
            </section>
            {s.results && (
              <section>
                <h2>Results</h2>
                {s.results.map((r) => (
                  <p key={r}>{r}</p>
                ))}
              </section>
            )}
            <section>
              <h2>Related capabilities</h2>
              <div className="related-links">
                {s.services.map((slug) => (
                  <Link href={`/services/${slug}`} key={slug}>
                    {services.find((s) => s.slug === slug)?.title || slug} ↗
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
        {related.length > 0 && (
          <section className="section">
            <SectionHead
              label="KEEP EXPLORING"
              title="Another way to connect."
            />
            <div className="work-grid">
              {related.map((s) => (
                <WorkCard key={s.slug} study={s} />
              ))}
            </div>
          </section>
        )}
        <div style={{ marginBottom: 50 }}>
          <BackLink href="/work" label="Back to experiences" />
        </div>
        <Cta />
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Work",
              item: origin + "/work",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: s.eyebrow,
              item: origin + "/work/" + slug,
            },
          ],
        }}
      />
    </>
  );
}
