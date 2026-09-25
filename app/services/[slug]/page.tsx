import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/content/services";
import { publishedStudies } from "@/content/work";
import { PageHero, Cta, SectionHead, WorkCard, Button } from "@/components/ui";
import { JsonLd, meta, origin } from "@/lib/seo";
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  return s ? meta(s.title, s.description, `/services/${slug}`) : {};
}
export default async function Service({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) notFound();
  const examples = publishedStudies
    .filter((s) => s.services.includes(slug))
    .slice(0, 2);
  return (
    <>
      <nav className="wrap breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/services">Services</Link> /{" "}
        {s.title}
      </nav>
      <PageHero
        label={s.title}
        title={s.headline}
        description={s.description}
      />
      <div className="wrap">
        <section className="content-section two-col">
          <h2>
            The interaction.
            <br />
            And everything behind it.
          </h2>
          <div>
            <p className="lead">{s.body}</p>
            <ul className="prose">
              {s.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </section>
        <section className="content-section two-col">
          <h2>What we’ll work through with you.</h2>
          <p className="lead">{s.consideration}</p>
        </section>
        {slug === "photo-experiences" && (
          <section className="content-section">
            <Button href="/photo-experiences">Explore FrameFlix</Button>
          </section>
        )}
        {examples.length > 0 && (
          <section className="section">
            <SectionHead
              label="EXPLORE THE CAPABILITY"
              title="See it in an experience."
            />
            <div className="work-grid">
              {examples.map((s) => (
                <WorkCard key={s.slug} study={s} />
              ))}
            </div>
          </section>
        )}
        <Cta />
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.title,
          description: s.description,
          url: origin + "/services/" + slug,
          provider: {
            "@type": "Organization",
            name: "InMoment Services",
            url: origin,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Services",
              item: origin + "/services",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: s.title,
              item: origin + "/services/" + slug,
            },
          ],
        }}
      />
    </>
  );
}
