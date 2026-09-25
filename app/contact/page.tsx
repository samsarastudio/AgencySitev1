import Link from "next/link";
import { PageHero } from "@/components/ui";
import { InquiryForm } from "@/components/inquiry-form";
import { meta } from "@/lib/seo";
export const metadata = meta(
  "Start a project",
  "Tell InMoment about your AI photobooth, photo experience, connected event or custom technology brief.",
  "/contact",
);
export default function Contact() {
  return (
    <>
      <nav className="wrap breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / Contact
      </nav>
      <PageHero
        label="START A PROJECT"
        title="What do you want to make happen?"
        description="A clear brief, a rough idea or a question about what’s possible. We’d like to hear it."
      />
      <section className="wrap contact-layout">
        <aside>
          <h2>Start with the moment.</h2>
          <p>
            Tell us about your audience, the experience and the date you are
            working toward. We can work through the technical questions
            together.
          </p>
          <p>
            <a
              href="mailto:hello@inmomentservices.com"
              data-event="email_click"
            >
              hello@inmomentservices.com ↗
            </a>
          </p>
          <p>Planning a celebration or local photo experience?</p>
          <Link className="text-link" href="/quote">
            Request a FrameFlix quote ↗
          </Link>
          <p style={{ marginTop: 35 }}>
            For files or a longer brief, email us directly. This form does not
            accept attachments.
          </p>
        </aside>
        <InquiryForm />
      </section>
    </>
  );
}
