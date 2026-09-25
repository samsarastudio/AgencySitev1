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
        description="Planning a booth, an AI portrait experience or something harder to describe? Here are a few things to think through before event day."
      />
      <section className="wrap">
        <InsightsBrowser articles={publishedArticles} />
      </section>
    </>
  );
}
