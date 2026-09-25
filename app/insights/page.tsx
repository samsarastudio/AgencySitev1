import { PageHero } from "@/components/ui";
import { InsightsBrowser } from "@/components/insights-browser";
import { publishedArticles } from "@/content/articles";
import { meta } from "@/lib/seo";
export const metadata = meta(
  "Insights & field notes",
  "Practical thinking on experiential AI, interactive technology, live production and FrameFlix photo experiences.",
  "/insights",
);
export default function Insights() {
  return (
    <>
      <PageHero
        label="INSIGHTS / FIELD NOTES"
        title="Behind every moment, a little thinking."
        description="Ideas, production questions and practical notes from the space between digital and physical."
      />
      <section className="wrap">
        <InsightsBrowser articles={publishedArticles} />
      </section>
    </>
  );
}
