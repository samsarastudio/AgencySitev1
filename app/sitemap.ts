import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/routes";
import { origin } from "@/lib/seo";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: origin + path,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
