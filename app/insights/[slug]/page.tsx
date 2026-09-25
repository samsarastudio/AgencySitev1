import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { publishedArticles, readingTime, headingId } from "@/content/articles";
import { PageHero, Button } from "@/components/ui";
import { BackLink } from "@/components/back-link";
import { meta, JsonLd, origin } from "@/lib/seo";
export function generateStaticParams() {
  return publishedArticles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = publishedArticles.find((a) => a.slug === slug);
  if (!a) return {};
  const m = meta(a.title, a.description, `/insights/${slug}`, a.image);
  return {
    ...m,
    openGraph: {
      ...m.openGraph,
      type: "article",
      publishedTime: a.published,
      modifiedTime: a.updated || a.published,
      authors: [a.author],
    },
  };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = publishedArticles.find((a) => a.slug === slug);
  if (!a) notFound();
  const index = publishedArticles.indexOf(a);
  const related = publishedArticles
    .filter(
      (x) =>
        x.slug !== slug &&
        (x.category === a.category || x.tags.some((t) => a.tags.includes(t))),
    )
    .slice(0, 3);
  return (
    <>
      <nav className="wrap breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/insights">Insights</Link> /{" "}
        {a.category}
      </nav>
      <PageHero
        label={a.category}
        title={a.title}
        description={a.description}
      />
      <div className="wrap">
        <p className="article-meta">
          {a.author} · <time dateTime={a.published}>{a.published}</time>
          {a.updated && (
            <>
              {" "}
              · Updated <time dateTime={a.updated}>{a.updated}</time>
            </>
          )}{" "}
          · {readingTime(a)} min read
        </p>
        <div className="article-cover">
          <Image
            src={a.image}
            alt={a.imageAlt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
          {a.imageCaption && (
            <span className="media-caption">{a.imageCaption}</span>
          )}
        </div>
        <div className="article-layout">
          <aside>
            <p className="eyebrow">IN THIS NOTE</p>
            <ol>
              {a.sections.map((s) => (
                <li key={s.heading}>
                  <a href={"#" + headingId(s.heading)}>{s.heading}</a>
                </li>
              ))}
            </ol>
          </aside>
          <article className="prose">
            {a.sections.map((s) => (
              <section key={s.heading}>
                <h2 id={headingId(s.heading)}>{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.items && (
                  <ul>
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <div className="tag-row">
              {a.tags.map((t) => (
                <Link href={"/insights?tag=" + encodeURIComponent(t)} key={t}>
                  #{t}
                </Link>
              ))}
            </div>
            <div className="content-section">
              <h2>Make it part of your next event.</h2>
              <p>
                Share the brief, the audience and the moment you have in mind.
              </p>
              <Button
                href={
                  a.category === "Photo Experiences" ? "/quote" : "/contact"
                }
                event="blog_cta"
              >
                {a.category === "Photo Experiences"
                  ? "Request a photo quote"
                  : "Start a project"}
              </Button>
            </div>
          </article>
        </div>
        <BackLink href="/insights" label="Back to insights" />
        <nav className="article-nav" aria-label="Previous and next articles">
          {index > 0 ? (
            <Link href={"/insights/" + publishedArticles[index - 1].slug}>
              <small>← PREVIOUS NOTE</small>
              {publishedArticles[index - 1].title}
            </Link>
          ) : (
            <span />
          )}
          {index < publishedArticles.length - 1 && (
            <Link href={"/insights/" + publishedArticles[index + 1].slug}>
              <small>NEXT NOTE →</small>
              {publishedArticles[index + 1].title}
            </Link>
          )}
        </nav>
        {related.length > 0 && (
          <section className="section">
            <h2>Keep thinking.</h2>
            <div className="article-teasers">
              {related.map((x) => (
                <Link href={"/insights/" + x.slug} key={x.slug}>
                  <p className="eyebrow">{x.category}</p>
                  <h3>{x.title}</h3>
                  <span>↗</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.description,
          image: origin + a.image,
          datePublished: a.published,
          dateModified: a.updated || a.published,
          author: { "@type": "Organization", name: a.author },
          publisher: { "@type": "Organization", name: "InMoment Services" },
          mainEntityOfPage: origin + "/insights/" + slug,
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
              name: "Insights",
              item: origin + "/insights",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: a.title,
              item: origin + "/insights/" + slug,
            },
          ],
        }}
      />
    </>
  );
}
