import Image from "next/image";
import { PhotoNav, PhotoProducts, LocalLinks } from "@/components/photo";
import { Button, SectionHead } from "@/components/ui";
import { meta, JsonLd, origin } from "@/lib/seo";
export const metadata = meta(
  "FrameFlix photo experiences",
  "DSLR photo booth, instant prints, custom fridge magnets, nameplates and Sticker Studio in Kitchener, Waterloo, Cambridge and Guelph.",
  "/photo-experiences",
  "/images/setup-magnet-booth.webp",
);
export default function PhotoExperiences() {
  return (
    <div className="photo-theme">
      <div className="wrap">
        <PhotoNav />
        <section className="photo-intro">
          <div>
            <p className="eyebrow">FRAMEFLIX / BY INMOMENT</p>
            <h1>
              The moment
              <br />
              comes home.
            </h1>
            <p className="lead">
              A photo worth keeping. A little piece of your event, made
              personal.
            </p>
            <p>
              DSLR photos, instant prints and custom fridge-magnet frames with
              your event nameplate. We bring the booth and the attendant. You
              bring the people.
            </p>
            <div className="button-row">
              <Button href="/quote" event="photo_quote">
                Plan your photo experience
              </Button>
            </div>
            <a
              className="text-link"
              style={{ marginTop: 20 }}
              href="https://frameflix.inmomentservices.com"
            >
              Visit frameflix.inmomentservices.com ↗
            </a>
          </div>
          <div className="photo-image">
            <Image
              src="/images/setup-magnet-booth.webp"
              alt="FrameFlix cream photo magnet held beside the existing ring-light photo booth"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width:600px) 100vw, 50vw"
            />
            <span className="media-caption">FrameFlix product imagery</span>
          </div>
        </section>
        <section className="section">
          <SectionHead
            label="SMALL OBJECTS. BIG MEMORIES."
            title="Make it yours."
          />
          <PhotoProducts />
        </section>
        <section className="content-section two-col">
          <h2>
            Pose. Print.
            <br />
            Put it on the fridge.
          </h2>
          <div>
            <p className="lead">
              Step up with a friend, strike a pose and pick up your photo in a
              custom magnet frame. Your attendant will help along the way.
            </p>
            <p>
              Add names, a date or approved event branding to the nameplate.
              Choose from blush, cream, mint and baby blue, with QR sharing and
              an online gallery as part of the photo experience.
            </p>
            <Button href="/packages">See event packages</Button>
          </div>
        </section>
        <section className="section">
          <SectionHead
            label="YOUR EVENT. YOUR NEIGHBOURHOOD."
            title="Locally operated. Personally planned."
          />
          <p>
            Serving Kitchener, Waterloo, Cambridge and Guelph. Tell us your
            venue and we’ll confirm the details.
          </p>
          <LocalLinks />
        </section>
        <section className="cta-section">
          <p className="eyebrow">LET’S MAKE SOMETHING PERSONAL.</p>
          <div>
            <h2>
              Tell us about
              <br />
              your celebration.
            </h2>
            <Button href="/quote" event="photo_quote">
              Request a quote
            </Button>
          </div>
          <p>
            Tell us when, where and roughly how many people are coming. We’ll
            help you choose the right package.
          </p>
        </section>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "FrameFlix photo experiences",
          provider: {
            "@type": "Organization",
            name: "InMoment Services",
            url: origin,
          },
          areaServed: ["Kitchener", "Waterloo", "Cambridge", "Guelph"],
          url: origin + "/photo-experiences",
        }}
      />
    </div>
  );
}
