import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/routes";
import { origin } from "@/lib/seo";
import { publicPosts } from "@/lib/blog-store";
import { connection } from "next/server";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.SITE_EXPORT !== "1") await connection();
  const routes = [
    ...publicRoutes.filter((p) => !p.startsWith("/insights/")),
    ...(await publicPosts()).map((p) => "/insights/" + p.slug),
  ];
  return routes.map((path) => ({
    url: origin + path,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
