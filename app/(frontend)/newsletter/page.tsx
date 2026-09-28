import { PageHero } from "@/components/ui";
import { NewsletterForm } from "@/components/newsletter-form";
import { meta } from "@/lib/seo";
export const metadata = meta(
  "Notes from InMoment",
  "Occasional ideas, builds and experiments from InMoment Services.",
  "/newsletter",
);
export default function Newsletter() {
  return (
    <>
      <PageHero label="STAY CURIOUS" title="Ideas, builds and experiments." />
      <div className="wrap">
        <NewsletterForm />
      </div>
    </>
  );
}
