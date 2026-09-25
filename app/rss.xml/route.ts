import { publishedArticles } from "@/content/articles";
import { origin } from "@/lib/seo";
export const dynamic = "force-static";
const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>InMoment — Field Notes</title><link>${origin}/insights</link><description>Ideas, builds and experiences from InMoment Services.</description><language>en-ca</language>${publishedArticles.map((a) => `<item><title>${escape(a.title)}</title><link>${origin}/insights/${a.slug}</link><guid>${origin}/insights/${a.slug}</guid><description>${escape(a.description)}</description><pubDate>${new Date(a.published + "T12:00:00Z").toUTCString()}</pubDate><category>${escape(a.category)}</category></item>`).join("")}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
