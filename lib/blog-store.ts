import { nativeContent } from "./cms-content";
import { getCMS } from "./cms";
import { lexicalToMarkdown } from "./bot-content";
import {
  postSchema,
  bodySections,
  visiblePost,
  type EditablePost,
} from "./blog-model";
import { articles, type Article } from "@/content/articles";
export { blogDirectory } from "./legacy-blog-store";
function plainText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: string; children?: unknown[]; root?: unknown };
  return (
    n.text ||
    (n.root ? plainText(n.root) : (n.children || []).map(plainText).join(" "))
  );
}
export function mapPost(doc: any): EditablePost & { richContent: any } {
  let body: string;
  try {
    body = lexicalToMarkdown(doc.content);
  } catch {
    body = plainText(doc.content);
  }
  const cover =
    typeof doc.featuredImage === "object" ? doc.featuredImage : null;
  return {
    id: doc.legacyId || doc.id,
    slug: doc.slug,
    title: doc.title,
    description: doc.excerpt,
    body,
    contentLexical: doc.content,
    richContent: doc.content,
    category: doc.category,
    tags: (doc.tags || []).map((t: { tag: string }) => t.tag),
    author: doc.author || "InMoment Team",
    published: (doc.publishedAt || doc.createdAt).slice(0, 10),
    publishedAt: doc.publishedAt || doc.createdAt,
    updated: doc.updatedAt?.slice(0, 10),
    draft: doc.status !== "published",
    image: cover?.url || doc.image || "/images/ai-portrait-kiosk.webp",
    imageAlt: cover?.alt || doc.imageAlt || doc.title,
    imageCaption: cover?.caption || doc.imageCaption || "",
    metaDescription: doc.metaDescription || undefined,
    revision: doc.updatedAt,
  };
}
export async function listPosts(): Promise<EditablePost[]> {
  const cms = await getCMS();
  const result = await cms.find({
    collection: "posts",
    pagination: false,
    depth: 1,
    sort: "-publishedAt",
    overrideAccess: true,
  });
  return result.docs.map(mapPost);
}
export async function publicPosts(): Promise<Article[]> {
  if (process.env.SITE_EXPORT === "1") return articles.filter((a) => !a.draft);
  const cms = await getCMS();
  const result = await cms.find({
    collection: "posts",
    pagination: false,
    depth: 1,
    sort: "-publishedAt",
    overrideAccess: false,
  });
  return result.docs
    .map(mapPost)
    .filter((p) => visiblePost(p))
    .map((p) => ({ ...p, sections: bodySections(p.body) }));
}
let saving = Promise.resolve();
export async function savePost(input: unknown, expected: string | null) {
  const post = postSchema.parse(input);
  const operation = saving.then(async () => {
    const cms = await getCMS();
    const current = (
      await cms.find({
        collection: "posts",
        where: { slug: { equals: post.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
    ).docs[0];
    if ((current?.updatedAt ?? null) !== expected) throw new Error("CONFLICT");
    const data = {
      slug: post.slug,
      title: post.title,
      excerpt: post.description,
      content: await nativeContent(post.body, post.contentLexical),
      category: post.category,
      tags: post.tags.map((tag) => ({ tag })),
      author: post.author,
      status: post.draft ? ("draft" as const) : ("published" as const),
      publishedAt: post.publishedAt || post.published + "T00:00:00.000Z",
      image: post.image,
      imageAlt: post.imageAlt,
      imageCaption: post.imageCaption,
      metaDescription: post.metaDescription,
      source: "openclaw" as const,
    };
    const saved = current
      ? await cms.update({
          collection: "posts",
          id: current.id,
          data,
          overrideAccess: true,
        })
      : await cms.create({ collection: "posts", data, overrideAccess: true });
    return mapPost(saved);
  });
  saving = operation.then(
    () => {},
    () => {},
  );
  return operation;
}
export async function checkBlogStorage() {
  const cms = await getCMS();
  await cms.count({ collection: "posts", overrideAccess: true });
}
