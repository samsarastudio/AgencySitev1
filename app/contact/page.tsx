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
            Who’s coming, what would you like them to do, and when is the event?
            Start there. You don’t need all the technical answers to get in
            touch.
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
            Have a moodboard, reference image or longer brief? Email it to us
            directly; attachments aren’t available in this form.
          </p>
        </aside>
        <InquiryForm />
      </section>
    </>
  );
}
