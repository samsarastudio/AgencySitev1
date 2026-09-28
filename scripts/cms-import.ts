import env from "@next/env";
env.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const { getCMS } = await import("../lib/cms");
const { listPosts } = await import("../lib/legacy-blog-store");
const { listInquiries } = await import("../lib/legacy-inquiry-store");
const { nativeContent } = await import("../lib/cms-content");
const cms = await getCMS();
let posts = 0,
  enquiries = 0;
try {
  for (const p of await listPosts()) {
    const existing = await cms.find({
      collection: "posts",
      where: { slug: { equals: p.slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.docs.length) continue;
    await cms.create({
      collection: "posts",
      overrideAccess: true,
      data: {
        title: p.title,
        slug: p.slug,
        excerpt: p.description,
        content: await nativeContent(p.body, p.contentLexical),
        category: p.category,
        tags: p.tags.map((tag) => ({ tag })),
        author: p.author,
        status: p.draft ? "draft" : "published",
        publishedAt: p.publishedAt || p.published + "T00:00:00.000Z",
        image: p.image,
        imageAlt: p.imageAlt,
        imageCaption: p.imageCaption,
        metaDescription: p.metaDescription,
        source: "import",
        legacyId: p.id,
      },
    });
    posts++;
  }
  for (const i of await listInquiries()) {
    if (
      (
        await cms.find({
          collection: "enquiries",
          where: { submissionId: { equals: i.id } },
          limit: 1,
          overrideAccess: true,
        })
      ).docs.length
    )
      continue;
    const { id, ...data } = i;
    await cms.create({
      collection: "enquiries",
      overrideAccess: true,
      data: { ...data, submissionId: id, status: "new" },
    });
    enquiries++;
  }
  console.log(
    `Imported ${posts} posts and ${enquiries} enquiries. Existing CMS records and original files were preserved.`,
  );
} finally {
  await cms.destroy();
}
