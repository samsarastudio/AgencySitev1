import { markdownToLexical } from "./bot-content";
import {
  mkdir,
  readFile,
  readdir,
  writeFile,
  rename,
  unlink,
} from "node:fs/promises";
import { resolve, join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { articles, type Article } from "@/content/articles";
import {
  postSchema,
  slugSchema,
  bodySections,
  visiblePost,
  type BlogPost,
  type EditablePost,
} from "./blog-model";
export const blogDirectory = () =>
  resolve(
    /* turbopackIgnore: true */ process.env.BLOG_DATA_DIR || "./data/blog",
  );
const seedPosts: BlogPost[] = articles.map((a) => ({
  ...a,
  draft: !!a.draft,
  body: a.sections
    .map(
      (s) =>
        `## ${s.heading}\n\n${s.paragraphs.join("\n\n")}${s.items?.length ? "\n\n" + s.items.map((i) => "- " + i).join("\n") : ""}`,
    )
    .join("\n\n"),
}));
const revision = (p: BlogPost) =>
  createHash("sha256")
    .update(JSON.stringify(postSchema.parse(p)))
    .digest("hex");
export async function listPosts(): Promise<EditablePost[]> {
  const map = new Map(seedPosts.map((p) => [p.slug, postSchema.parse(p)]));
  let files: string[];
  try {
    files = await readdir(join(blogDirectory(), "posts"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    files = [];
  }
  for (const file of files.filter((f) => f.endsWith(".json"))) {
    const p = postSchema.parse(
      JSON.parse(await readFile(join(blogDirectory(), "posts", file), "utf8")),
    );
    if (file !== p.slug + ".json") throw new Error("Post filename mismatch");
    map.set(p.slug, p);
  }
  return [...map.values()]
    .map((p) => ({ ...p, revision: revision(p) }))
    .sort((a, b) => b.published.localeCompare(a.published));
}
export async function publicPosts(): Promise<Article[]> {
  const posts = process.env.SITE_EXPORT === "1" ? seedPosts : await listPosts();
  return posts
    .filter((p) => visiblePost(p))
    .map((p) => ({ ...p, sections: bodySections(p.body) }))
    .sort((a, b) => b.published.localeCompare(a.published));
}
let saving = Promise.resolve();
export async function savePost(input: unknown, expected: string | null) {
  const post = postSchema.parse(input);
  post.contentLexical = markdownToLexical(post.body);
  slugSchema.parse(post.slug);
  post.id ??=
    parseInt(
      createHash("sha256").update(post.slug).digest("hex").slice(0, 12),
      16,
    ) || 1;
  const operation = saving.then(async () => {
    const previous = (await listPosts()).find((p) => p.slug === post.slug);
    if ((previous?.revision ?? null) !== expected) throw new Error("CONFLICT");
    const dir = join(blogDirectory(), "posts");
    await mkdir(dir, { recursive: true });
    if (previous) {
      const history = join(blogDirectory(), "history", post.slug);
      await mkdir(history, { recursive: true });
      await writeFile(
        join(history, Date.now() + "-" + randomUUID() + ".json"),
        JSON.stringify(previous, null, 2),
        { mode: 0o600 },
      );
    }
    const tmp = join(dir, post.slug + "." + randomUUID() + ".tmp");
    await writeFile(tmp, JSON.stringify(post, null, 2) + "\n", { mode: 0o600 });
    await rename(tmp, join(dir, post.slug + ".json"));
    return { ...post, revision: revision(post) };
  });
  saving = operation.then(
    () => {},
    () => {},
  );
  return operation;
}

// Authenticated readiness check: verify reads and atomic writes without creating a post.
export async function checkBlogStorage() {
  await listPosts();
  const dir = join(blogDirectory(), "posts");
  await mkdir(dir, { recursive: true });
  const probe = join(dir, ".probe-" + randomUUID());
  const renamed = probe + ".checked";
  try {
    await writeFile(probe, "ready", { flag: "wx", mode: 0o600 });
    await rename(probe, renamed);
    if ((await readFile(renamed, "utf8")) !== "ready")
      throw new Error("Storage verification failed");
  } finally {
    await Promise.all(
      [probe, renamed].map((p) =>
        unlink(p).catch((e) => {
          if (e.code !== "ENOENT") throw e;
        }),
      ),
    );
  }
}
