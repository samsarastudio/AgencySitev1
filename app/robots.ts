import type { MetadataRoute } from "next";
import { origin } from "@/lib/seo";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules:
      process.env.NEXT_PUBLIC_PREVIEW === "1"
        ? { userAgent: "*", disallow: "/" }
        : { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: origin + "/sitemap.xml",
  };
}
