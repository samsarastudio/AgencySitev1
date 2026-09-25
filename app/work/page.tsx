import { PageHero, Cta } from "@/components/ui";
import { WorkFilter } from "@/components/work-filter";
import { publishedStudies } from "@/content/work";
import { meta } from "@/lib/seo";
export const metadata = meta(
  "Work & experience designs",
  "Explore the ideas, interactions and technical approaches behind AI portraits, live AR, gesture games and connected event experiences.",
  "/work",
);
export default function Work() {
  return (
    <>
      <PageHero
        label="WORK / EXPERIENCE DESIGNS"
        title="A little hard to explain. A lot better to experience."
        description="Explore the thinking behind a selection of interactive experiences. Each study describes its scope and technical approach; concept visualizations illustrate the interaction."
      />
      <section className="wrap work-index">
        <WorkFilter studies={publishedStudies} />
      </section>
      <div className="wrap">
        <Cta />
      </div>
    </>
  );
}
