import { createHash, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";
import { z } from "zod";
const blankOptional = (v: unknown) =>
  typeof v === "string" && !v.trim() ? undefined : v;
export const botPostSchema = z
  .object({
    title: z.string().trim().min(1).max(160),
    slug: z.preprocess(
      blankOptional,
      z
        .string()
        .trim()
        .min(1)
        .max(100)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .optional(),
    ),
    excerpt: z.string().max(320).optional(),
    content: z.preprocess(
      blankOptional,
      z.string().trim().min(1).max(100000).optional(),
    ),
    contentLexical: z.record(z.string(), z.unknown()).optional(),
    status: z.enum(["published", "draft"]).default("published"),
    publishedAt: z.preprocess(
      blankOptional,
      z.string().trim().datetime({ offset: true }).optional(),
    ),
    category: z.enum(["tips", "events", "studio", "trends"]).default("tips"),
    tags: z
      .array(z.string().trim().max(50))
      .max(15)
      .default([])
      .transform((tags) => tags.filter(Boolean)),
    author: z.preprocess(
      blankOptional,
      z.string().trim().min(2).max(100).default("FrameFlix Team"),
    ),
    metaDescription: z.string().max(160).optional(),
  })
  .refine(
    (p) => p.content || p.contentLexical,
    "Provide content or contentLexical",
  );
export function validBotKey(header: string | null) {
  const key = process.env.OPENCLAW_API_KEY;
  if (!key || key.length < 32 || !header?.startsWith("Bearer ")) return false;
  const digest = (v: string) => createHash("sha256").update(v).digest();
  return timingSafeEqual(digest(header.slice(7)), digest(key));
}
export const botSlug = (title: string) =>
  title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100)
    .replace(/-$/, "");
const buckets = new Map<string, { count: number; until: number }>();
export function botRateLimit(ip: string, now = Date.now()) {
  for (const [k, v] of buckets) if (v.until <= now) buckets.delete(k);
  if (!buckets.has(ip) && buckets.size >= 10000)
    return { allowed: false, retryAfter: 60 };
  const b = buckets.get(ip) || { count: 0, until: now + 60000 };
  b.count++;
  buckets.set(ip, b);
  return {
    allowed: b.count <= 10,
    retryAfter: Math.max(1, Math.ceil((b.until - now) / 1000)),
  };
}
export function botClientIp(headers: Headers) {
  const ip = headers.get("cf-connecting-ip") || "";
  return process.env.TRUST_CLOUDFLARE === "true" && isIP(ip) ? ip : "shared";
}
