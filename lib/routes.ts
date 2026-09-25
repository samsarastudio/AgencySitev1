import { publishedStudies } from "@/content/work";
import { publishedArticles } from "@/content/articles";
import { services } from "@/content/services";
import { localPages, editorialPages } from "@/content/pages";
export const publicRoutes = [
  "/",
  "/work",
  "/services",
  "/photo-experiences",
  "/insights",
  "/contact",
  "/quote",
  "/newsletter",
  "/packages",
  "/gallery",
  "/fridge-magnet-frames",
  "/stickers",
  "/faq",
  "/privacy",
  "/disclaimer",
  ...editorialPages.map((p) => "/" + p.slug),
  ...localPages.map((p) => "/" + p.slug),
  ...publishedStudies.map((s) => "/work/" + s.slug),
  ...services.map((s) => "/services/" + s.slug),
  ...publishedArticles.map((a) => "/insights/" + a.slug),
];
