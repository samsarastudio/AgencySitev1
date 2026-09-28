import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { editorialPages, localPages, faqs } from "@/content/pages";
import legal from "@/content/legal.json";
import { services } from "@/content/services";
import { PageHero, Button, Cta, SectionHead } from "@/components/ui";
import {
  PhotoNav,
  Packages,
  LocalLinks,
  PhotoProducts,
} from "@/components/photo";
import { Gallery } from "@/components/gallery";
import { meta, JsonLd, origin } from "@/lib/seo";
const extra = [
  {
    slug: "packages",
    title: "Event packages",
    description:
      "Compare FrameFlix Essential, Premium and Signature photo booth and keepsake packages.",
  },
  {
    slug: "gallery",
    title: "FrameFlix product gallery",
    description:
      "Explore our booth, fridge-magnet colours, custom nameplates and Sticker Studio product imagery.",
  },
  {
    slug: "fridge-magnet-frames",
    title: "Custom fridge-magnet frames",
    description:
      "A photo, a pastel frame and a nameplate for your event. Explore FrameFlix custom fridge magnets.",
  },
  {
    slug: "stickers",
    title: "Sticker Studio",
    description:
      "Live print-and-cut photo stickers, smart subject cutouts, labels and party favours for your event.",
  },
  {
    slug: "faq",
    title: "Frequently asked questions",
    description:
      "Photo booth coverage, frame quantities, gallery access, service areas and custom technology questions.",
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description:
      "How inquiry information, gallery access and optional analytics are handled.",
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    description:
      "Information about quotes, product imagery, coverage, quantities and service limitations.",
  },
];
export function generateStaticParams() {
  return [...editorialPages, ...localPages, ...extra].map((p) => ({
    slug: p.slug,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = [...editorialPages, ...localPages, ...extra].find(
    (p) => p.slug === slug,
  );
  return p ? meta(p.title, p.description, "/" + slug) : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const editorial = editorialPages.find((p) => p.slug === slug);
  const local = localPages.find((p) => p.slug === slug);
  const p = extra.find((p) => p.slug === slug);
  if (!editorial && !local && !p) notFound();
  const title = editorial?.title || local?.title || p!.title;
  const crumbs = (
    <nav className="wrap breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Home</Link> /{" "}
      {local ||
      [
        "packages",
        "gallery",
        "fridge-magnet-frames",
        "stickers",
        "faq",
      ].includes(slug) ? (
        <>
          <Link href="/photo-experiences">Photo Experiences</Link> /{" "}
        </>
      ) : null}
      <span>{local?.city || p?.title || editorial?.label}</span>
    </nav>
  );
  const schema = (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: origin },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: origin + "/" + slug,
          },
        ],
      }}
    />
  );
  if (editorial)
    return (
      <>
        {crumbs}
        <PageHero
          label={editorial.label}
          title={editorial.title}
          description={editorial.description}
        />
        <div className="wrap">
          {editorial.sections.map((s, i) => (
            <section key={s.title} className="content-section two-col">
              <div>
                <p className="eyebrow">0{i + 1}</p>
                <h2>{s.title}</h2>
              </div>
              <p className="lead">{s.body}</p>
            </section>
          ))}
          <section className="section">
            <SectionHead label="EXPLORE FURTHER" title="A closer look." />
            <div className="related-links">
              <Link href="/work">Experience designs ↗</Link>
              <Link href="/services">Services ↗</Link>
              <Link href="/photo-experiences">FrameFlix ↗</Link>
            </div>
          </section>
          <Cta />
        </div>
        {schema}
      </>
    );
  if (slug === "privacy" || slug === "disclaimer") {
    const l = legal[slug];
    return (
      <>
        {crumbs}
        <PageHero label="INFORMATION" title={l.title} />
        <article className="wrap legal-content">
          <p>Last updated: {l.updated}</p>
          {l.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
          <Link
            className="text-link"
            href={slug === "privacy" ? "/disclaimer" : "/privacy"}
          >
            {slug === "privacy"
              ? "Read the disclaimer"
              : "Read the privacy policy"}{" "}
            ↗
          </Link>
        </article>
        {schema}
      </>
    );
  }
  if (slug === "faq")
    return (
      <>
        {crumbs}
        <PageHero
          label="QUESTIONS / ANSWERS"
          title="A few things worth knowing."
          description="Wondering about booth time, keepsakes or how to get started? Here are the answers to a few common questions."
        />
        <div className="wrap faq-list">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
          <div style={{ marginTop: 40 }}>
            <Button href="/contact">Ask us something else</Button>
          </div>
        </div>
        {schema}
      </>
    );
  if (local)
    return (
      <div className="photo-theme">
        {crumbs}
        <div className="wrap">
          <PhotoNav />
        </div>
        <PageHero
          label={"FRAMEFLIX / " + local.city}
          title={local.title}
          description={local.description}
        />
        <div className="wrap">
          <section className="photo-intro">
            <div className="photo-image">
              <Image
                src={
                  slug.includes("sticker")
                    ? "/images/stickers-hero.webp"
                    : "/images/setup-booth-magnets.webp"
                }
                alt={
                  "FrameFlix product imagery for " +
                  local.city +
                  " event planning"
                }
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width:600px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2>Built around your occasion.</h2>
              <p className="lead">{local.context}</p>
              <p>
                Custom nameplates, DSLR photos, instant prints, QR sharing and
                an online gallery. Add Sticker Studio or discuss a custom
                backdrop in your quote.
              </p>
              <Button
                href={"/quote?city=" + encodeURIComponent(local.city)}
                event="photo_quote"
              >
                Plan your event
              </Button>
            </div>
          </section>
          <section className="section">
            <SectionHead
              label="COVERAGE + KEEPSAKES"
              title="Choose your starting point."
            />
            <Packages />
          </section>
          <section className="content-section">
            <h2>Nearby, too.</h2>
            <p>
              {local.nearby}. Send your venue address so we can confirm access
              and travel details.
            </p>
            <LocalLinks />
          </section>
          <section className="section">
            <h2>Setup is part of the plan.</h2>
            <div className="two-col">
              <p>
                Essential and Premium include three active hours with an
                attendant. Setup and teardown sit outside the coverage window.
                Share your event schedule and venue access requirements before
                finalizing the booking.
              </p>
              <p>
                Confirm the physical frame count and gallery period in writing.
                Essential includes 60 frames and three months of gallery access;
                Premium includes 120 frames and twelve months. Signature details
                are customized.
              </p>
            </div>
            <Button href="/photo-experiences" secondary>
              Back to photo experiences
            </Button>
          </section>
        </div>
        {schema}
      </div>
    );
  if (slug === "packages")
    return (
      <div className="photo-theme">
        {crumbs}
        <div className="wrap">
          <PhotoNav />
        </div>
        <PageHero
          label="FRAMEFLIX / EVENT PACKAGES"
          title="Your people. Your kind of package."
          description="The booth, an attendant and keepsakes made for your occasion. Every event receives a custom quote."
        />
        <div className="wrap">
          <Packages />
          <section className="section two-col">
            <div>
              <h2>Three hours means three active hours.</h2>
              <p>
                For Essential and Premium, setup and teardown happen outside
                your coverage window. Your attendant handles the booth so you
                can stay with your guests.
              </p>
            </div>
            <div>
              <h2>Make room for the extras.</h2>
              <p>
                Discuss additional frames in 20-packs, extra coverage, a custom
                backdrop, video/GIF clips or a photo album. Availability and
                details are confirmed in your quote.
              </p>
              <Button href="/quote" event="photo_quote">
                Request your package quote
              </Button>
            </div>
          </section>
        </div>
        {schema}
      </div>
    );
  if (slug === "gallery")
    return (
      <div className="photo-theme">
        {crumbs}
        <div className="wrap">
          <PhotoNav />
        </div>
        <PageHero
          label="FRAMEFLIX / PRODUCT GALLERY"
          title="The little details make it personal."
          description="Take a look at the colours, frames and sticker ideas. These images illustrate the options; we’ll confirm your event’s design and setup with you."
        />
        <div className="wrap">
          <Gallery />
          <section className="section">
            <Button href="/quote" event="photo_quote">
              Make it part of your event
            </Button>
          </section>
        </div>
        {schema}
      </div>
    );
  const magnets = slug === "fridge-magnet-frames";
  return (
    <div className="photo-theme">
      {crumbs}
      <div className="wrap">
        <PhotoNav />
        <section className="photo-intro">
          <div>
            <p className="eyebrow">
              FRAMEFLIX / {magnets ? "CUSTOM MAGNETS" : "STICKER STUDIO"}
            </p>
            <h1>
              {magnets
                ? "A place on the fridge. A place in the memory."
                : "A little personality. Cut to shape."}
            </h1>
            <p className="lead">
              {magnets
                ? "A guest photo, a pastel magnet frame and a nameplate made for your event."
                : "Photo stickers, labels and favours printed and cut at your event."}
            </p>
            <p>
              {magnets
                ? "Choose blush, cream, mint or baby blue. Add names, a date or an approved logo. Pair with our DSLR photo booth for an attendant-operated keepsake experience."
                : "Smart subject cutouts and custom artwork turn photos into personal stickers. Book the station alone or together with our magnet experience. Sticker format and capacity are quoted around your guest count."}
            </p>
            <Button
              href={"/quote?service=" + (magnets ? "Magnets" : "Stickers")}
              event="photo_quote"
            >
              {magnets ? "Enquire about magnets" : "Request a sticker quote"}
            </Button>
          </div>
          <div className="photo-image">
            <Image
              src={
                magnets
                  ? "/images/magnet-hero-pink.webp"
                  : "/images/stickers-hero.webp"
              }
              alt={
                magnets
                  ? "Pink FrameFlix photo magnet product imagery"
                  : "FrameFlix sticker shapes and photo cutouts product imagery"
              }
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width:600px) 100vw, 50vw"
            />
            <span className="media-caption">FrameFlix product imagery</span>
          </div>
        </section>
        <section className="content-section two-col">
          <h2>
            {magnets
              ? "Names. Dates. Your own little detail."
              : "From photo to finished sticker."}
          </h2>
          <div>
            <p>
              {magnets
                ? "Your names, a date or a little message can make it yours. Send us the wording and any approved artwork, and we’ll share a proof for you to check before we make it."
                : "Our attendant handles the printing and cutting while guests watch their stickers take shape. Tell us whether you’re thinking of photo stickers, name tags or event labels, and ask us for examples."}
            </p>
            <p>
              Tell us your date, venue and guest count. We’ll help you choose
              the quantities and booth time, then put everything in your quote.
            </p>
            <a
              className="text-link"
              href="https://frameflix.inmomentservices.com"
            >
              Visit the FrameFlix website ↗
            </a>
          </div>
        </section>
        <section className="section">
          <PhotoProducts />
        </section>
      </div>
      {schema}
    </div>
  );
}
