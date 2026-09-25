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
        description="See what guests do, how each experience works and the details that need care. These are experience designs with their scope noted; the images are concept illustrations."
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
