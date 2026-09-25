import { publicPosts } from "@/lib/blog-store";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { Button, SectionHead, WorkCard, Cta, Arrow } from "@/components/ui";
import { Signal } from "@/components/signal";
import { publishedStudies } from "@/content/work";
import { meta } from "@/lib/seo";
export const metadata = meta(
  "AI photobooths. Unforgettable photo experiences.",
  "AI photobooths, custom photo experiences, connected event journeys and interactive technology for brands, agencies and event producers.",
  "/",
);
export default async function Home() {
  if (process.env.SITE_EXPORT !== "1") await connection();
  const posts = (await publicPosts()).slice(0, 3);
  return (
    <>
      <section className="home-hero wrap">
        <div className="hero-topline">
          <p className="eyebrow">
            AI PHOTOBOOTHS / PHOTO EXPERIENCES / EVENT TECHNOLOGY
          </p>
          <span className="hero-note">A new way to picture the moment.</span>
        </div>
        <h1>
          Put your guests
          <br />
          in the <em>picture</em>
          <span className="orange">.</span>
        </h1>
        <div className="hero-bottom">
          <p>
            We build AI photobooths and photo experiences that give people a
            reason to join in.
            <br className="desktop-break" /> From the first pose to the photo
            they take home.
          </p>
          <div className="button-row">
            <Button href="/contact" event="start_project">
              Start a project
            </Button>
            <Link className="text-link" href="#selected-work">
              Explore the work <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/images/ai-portrait-kiosk.webp"
            alt="AI photobooth concept with a custom InMoment kiosk, integrated camera and touchscreen, and a separate photo printer"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
          <div className="visual-title">
            <span>FROM CAPTURE TO KEEPSAKE</span>
            <p>
              Their photo.
              <br />
              Your world.
            </p>
          </div>
          <Link
            href="/work/ai-portrait-experience"
            className="visual-link"
            aria-label="Explore the AI photobooth experience"
          >
            <Arrow />
          </Link>
          <span className="media-caption">
            AI photobooth / Concept visualization
          </span>
        </div>
      </section>
      <div className="wrap">
        <Signal />
      </div>
      <section id="selected-work" className="section wrap">
        <SectionHead
          label="01 / SELECTED EXPERIENCE DESIGNS"
          title="Made to be part of."
          href="/work"
          link="View all experiences"
        />
        <p className="section-intro">
          A guest becomes a racing driver. Individual selfies become one shared
          picture. A screen opens onto another world. Here’s how those ideas
          come together.
        </p>
        <div className="work-grid">
          {[
            publishedStudies.find((s) => s.slug === "ai-portrait-experience")!,
            publishedStudies.find((s) => s.slug === "live-photo-mosaic")!,
            publishedStudies.find((s) => s.slug === "environmental-ar-mirror")!,
          ].map((s, i) => (
            <WorkCard key={s.slug} study={s} index={i} />
          ))}
        </div>
      </section>
      <section className="photo-feature">
        <div className="photo-feature-image">
          <Image
            src="/images/setup-magnet-booth.webp"
            alt="Existing FrameFlix product image of a cream magnet held beside the ring-light booth"
            fill
            sizes="(max-width: 720px) 100vw, 50vw"
          />
          <span className="media-caption">FrameFlix product imagery</span>
        </div>
        <div className="photo-feature-copy">
          <p className="eyebrow">FRAMEFLIX / BY INMOMENT</p>
          <h2>
            A moment
            <br />
            they take home.
          </h2>
          <p>
            A favourite photo deserves a spot on the fridge. FrameFlix brings
            the booth, instant prints and custom magnets or stickers to your
            celebration. We run the station so you can enjoy it, too.
          </p>
          <Button href="/photo-experiences" secondary>
            Explore photo experiences
          </Button>
          <a
            className="text-link"
            style={{ marginTop: 20 }}
            href="https://frameflix.inmomentservices.com"
          >
            Visit the FrameFlix website ↗
          </a>
          <span className="small-note">
            Kitchener · Waterloo · Cambridge · Guelph
          </span>
        </div>
      </section>
      <section className="light-section">
        <div className="wrap section">
          <SectionHead
            label="02 / WHAT WE BUILD"
            title="The idea is just the beginning."
            href="/services"
            link="Our capabilities"
          />
          <div className="capability-list">
            {[
              [
                "Experiential AI",
                "Turn a guest’s photo into a portrait made for your event, ready to share or print.",
                "experiential-ai",
              ],
              [
                "Interactive experiences",
                "Real-time scenes, gesture-driven games and displays that respond to people.",
                "interactive-experiences",
              ],
              [
                "Event software",
                "Help guests sign in, take part and find their photos without getting lost along the way.",
                "event-software",
              ],
              [
                "Hardware + software",
                "Cameras, sensors, displays and printers working as one experience.",
                "hardware-software-integration",
              ],
            ].map(([title, body, slug], i) => (
              <Link href={`/services/${slug}`} key={slug}>
                <span className="row-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="hard-brief wrap section">
        <p className="eyebrow">THE HARD PART IS OUR KIND OF PART.</p>
        <h2>
          “Can this
          <br />
          even be <em>done?</em>”
        </h2>
        <div>
          <p>
            That’s a good place to start. Tell us the idea, even if you haven’t
            worked out how it would run. We’ll help you test the tricky parts
            and find a practical way to build it.
          </p>
          <Button href="/for-agencies" secondary>
            Meet your technical partner
          </Button>
        </div>
      </section>
      <section className="section wrap">
        <SectionHead
          label="03 / HOW WE GET THERE"
          title="Good ideas deserve a good build."
        />
        <div className="process-grid">
          {[
            [
              "Understand",
              "Tell us who’s coming, what you have in mind and where it needs to happen.",
            ],
            [
              "Prototype",
              "Try the part we need to get right before committing to the full build.",
            ],
            [
              "Build",
              "Connect the photos, software and equipment into one experience.",
            ],
            [
              "Test",
              "Walk through it as a guest, then check what happens when something goes wrong.",
            ],
            [
              "Launch",
              "Get the team ready to run it, with the handoff and support we’ve agreed together.",
            ],
          ].map(([h, p], i) => (
            <div key={h}>
              <span>0{i + 1}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="agency-strip wrap">
        <p className="eyebrow">
          FOR BRANDS. FOR AGENCIES. FOR THE PEOPLE MAKING IT HAPPEN.
        </p>
        <h2>
          Already have the campaign?
          <br />
          Bring us in for the technology.
        </h2>
        <Link className="text-link" href="/for-agencies">
          Working together <Arrow />
        </Link>
      </section>
      <section className="section wrap">
        <SectionHead
          label="04 / FIELD NOTES"
          title="Things worth figuring out before event day."
          href="/insights"
          link="All insights"
        />
        <div className="article-teasers">
          {posts.map(({ title, slug, category: cat }) => (
            <Link href={`/insights/${slug}`} key={slug}>
              <span className="eyebrow">{cat}</span>
              <h3>{title}</h3>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>
      <div className="wrap">
        <Cta />
      </div>
    </>
  );
}
