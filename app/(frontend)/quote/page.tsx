import Link from "next/link";
import { PageHero } from "@/components/ui";
import { InquiryForm } from "@/components/inquiry-form";
import { meta } from "@/lib/seo";
export const metadata = meta(
  "Request a FrameFlix quote",
  "Plan your photo booth, custom fridge magnets or Sticker Studio with an event-specific FrameFlix quote.",
  "/quote",
);
export default function Quote() {
  return (
    <>
      <nav className="wrap breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> /{" "}
        <Link href="/photo-experiences">Photo Experiences</Link> / Quote
      </nav>
      <PageHero
        label="FRAMEFLIX / YOUR EVENT"
        title="Let’s make it personal."
        description="Share the date, the place and the people. We’ll help shape the photo experience."
      />
      <section className="wrap contact-layout">
        <aside>
          <h2>A quote for your occasion.</h2>
          <p>
            Essential includes 60 guest frames and three months of gallery
            access. Premium includes 120 frames and twelve months. Both include
            three active hours and an attendant, with setup outside that window.
          </p>
          <p>
            Signature packages and sticker experiences are tailored in your
            quote. No payment is taken here.
          </p>
          <Link className="text-link" href="/packages">
            ← Compare packages
          </Link>
          <p style={{ marginTop: 30 }}>
            <a href="https://frameflix.inmomentservices.com">
              Visit FrameFlix ↗
            </a>
          </p>
          <p>
            <a
              href="mailto:hello@inmomentservices.com"
              data-event="email_click"
            >
              hello@inmomentservices.com
            </a>
          </p>
        </aside>
        <InquiryForm photo />
      </section>
    </>
  );
}
