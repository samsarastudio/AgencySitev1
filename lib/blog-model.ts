import { z } from "zod";
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
    "Use a valid date",
  );
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase words separated by hyphens",
  );
export const postSchema = z.object({
  id: z.number().int().positive().optional(),
  metaDescription: z.string().max(160).optional(),
  publishedAt: z.string().datetime({ offset: true }).optional(),
  contentLexical: z.record(z.string(), z.unknown()).optional(),
  slug: slugSchema,
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(320),
  category: z.string().trim().min(2).max(80),
  tags: z.array(z.string().trim().min(1).max(50)).max(15),
  author: z.string().trim().min(2).max(100),
  published: date,
  updated: date.optional(),
  image: z
    .string()
    .regex(
      /^\/(?:images\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g)|api\/blog-media\/[a-f0-9-]+\.webp)$/,
    )
    .refine((v) => !v.includes(".."), "Invalid image path"),
  imageAlt: z.string().trim().min(3).max(300),
  imageCaption: z.string().max(160).optional(),
  body: z.string().trim().min(1).max(100000),
  draft: z.boolean(),
});
export type BlogPost = z.infer<typeof postSchema>;
export type EditablePost = BlogPost & { revision: string };
export function bodySections(body: string) {
  const blocks = body.split(/^## /m);
  return blocks
    .map((block, i) => {
      const end = block.indexOf("\n");
      return {
        heading: i === 0 ? "" : end < 0 ? block : block.slice(0, end),
        paragraphs: [i === 0 ? block : block.slice(end + 1)],
      };
    })
    .filter((s) => s.heading || s.paragraphs[0].trim());
}
export function visiblePost(post: BlogPost, now = new Date()) {
  return (
    !post.draft &&
    (post.publishedAt
      ? Date.parse(post.publishedAt) <= now.getTime()
      : post.published <= now.toISOString().slice(0, 10))
  );
}
