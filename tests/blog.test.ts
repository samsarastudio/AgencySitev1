import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { scryptSync, randomBytes } from "node:crypto";
import { NextRequest } from "next/server";
import { listPosts, publicPosts, savePost } from "../lib/blog-store";
import {
  makeSession,
  validSession,
  verifyPassword,
  guard,
} from "../lib/admin-auth";
import { POST as botPost } from "../app/api/bot/posts/route";
import {
  GET as readAdmin,
  PUT as writeAdmin,
} from "../app/api/admin/posts/route";
import { POST as upload } from "../app/api/admin/upload/route";
import { markdownToLexical, lexicalToMarkdown } from "../lib/bot-content";
import { botRateLimit } from "../lib/bot-api";
import { postSchema } from "../lib/blog-model";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { BlogMarkdown } from "../components/blog-markdown";
test("blog persistence, API contract and protection", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "inmoment-blog-test-"));
  process.env.BLOG_DATA_DIR = dir;
  process.env.ADMIN_ORIGIN = "http://localhost:3000";
  process.env.BOT_API_HOST = "localhost";
  process.env.OPENCLAW_API_KEY = randomBytes(32).toString("hex");
  process.env.ADMIN_SESSION_SECRET = randomBytes(32).toString("hex");
  process.env.ADMIN_PASSWORD_HASH =
    "test-salt:" +
    scryptSync("test-password-long", "test-salt", 64).toString("hex");
  const request = (data: unknown, headers: Record<string, string> = {}) =>
    new NextRequest("http://localhost:3000/api/bot/posts", {
      method: "POST",
      headers: {
        host: "localhost:3000",
        "content-type": "application/json",
        authorization: "Bearer " + process.env.OPENCLAW_API_KEY,
        ...headers,
      },
      body: JSON.stringify(data),
    });
  const payload = {
    title: "A test post",
    content: "# Heading\n\nA **personal** photo experience.",
    slug: "automated-blog-check",
    category: "trends",
    metaDescription: "A test summary.",
  };
  try {
    await t.test("API rejects wrong key and hostname", async () => {
      assert.equal(
        (await botPost(request(payload, { authorization: "Bearer wrong" })))
          .status,
        401,
      );
      assert.equal(
        (await botPost(request(payload, { host: "unrelated.example" }))).status,
        404,
      );
    });
    await t.test("creates once and upserts the same numeric id", async () => {
      const a = await botPost(request(payload));
      assert.equal(a.status, 201);
      const first = await a.json();
      assert.equal(first.action, "created");
      assert.equal(typeof first.id, "number");
      const b = await botPost(request({ ...payload, title: "Updated title" }));
      const second = await b.json();
      assert.equal(second.action, "updated");
      assert.equal(second.id, first.id);
      assert.equal(
        (await listPosts()).filter((p) => p.slug === payload.slug).length,
        1,
      );
      const disk = JSON.parse(
        await readFile(join(dir, "posts", payload.slug + ".json"), "utf8"),
      );
      assert.equal(disk.title, "Updated title");
      assert.equal(disk.contentLexical.root.type, "root");
    });
    await t.test(
      "drafts and future posts never reach public queries",
      async () => {
        await botPost(request({ ...payload, status: "draft" }));
        assert.ok(!(await publicPosts()).some((p) => p.slug === payload.slug));
        await botPost(
          request({ ...payload, publishedAt: "2099-01-01T19:00:00.000Z" }),
        );
        assert.ok(!(await publicPosts()).some((p) => p.slug === payload.slug));
      },
    );
    await t.test("Lexical input and defaults work", async () => {
      const r = await botPost(
        request({
          title: "Lexical check",
          contentLexical: markdownToLexical(
            "## Hello\n\nThis is **formatted** text.",
          ),
        }),
      );
      assert.equal(r.status, 201);
      const p = (await listPosts()).find((p) => p.slug === "lexical-check")!;
      assert.equal(p.category, "tips");
      assert.equal(p.draft, false);
      assert.match(p.body, /\*\*formatted\*\*/);
      assert.ok((await publicPosts()).some((p) => p.slug === "lexical-check"));
      const bad = await botPost(
        request({
          title: "Invalid category",
          content: "Text",
          category: "unknown",
        }),
      );
      assert.equal(bad.status, 400);
    });
    await t.test(
      "returned save revision permits the next editor save",
      async () => {
        const seed = (await listPosts())[0];
        const created = await savePost(
          { ...seed, id: undefined, slug: "revision-roundtrip", draft: true },
          null,
        );
        const published = await savePost(
          { ...created, draft: false },
          created.revision,
        );
        assert.equal(published.draft, false);
        assert.equal(
          (await listPosts()).find((p) => p.slug === published.slug)?.revision,
          published.revision,
        );
      },
    );
    await t.test("write conflicts preserve the newer version", async () => {
      const old = (await listPosts()).find((p) => p.slug === payload.slug)!;
      await savePost({ ...old, title: "Fresh edit" }, old.revision);
      await assert.rejects(
        () => savePost({ ...old, title: "Stale edit" }, old.revision),
        /CONFLICT/,
      );
      assert.equal(
        (await listPosts()).find((p) => p.slug === payload.slug)?.title,
        "Fresh edit",
      );
    });
    await t.test(
      "admin requires a valid session and matching origin",
      async () => {
        assert.equal(
          (
            await readAdmin(
              new NextRequest("http://localhost:3000/api/admin/posts"),
            )
          ).status,
          401,
        );
        const token = makeSession();
        assert.ok(validSession(token));
        assert.ok(!validSession(token + "x"));
        assert.ok(await verifyPassword("test-password-long"));
        assert.ok(!(await verifyPassword("wrong")));
        const req = new NextRequest("http://localhost:3000/api/admin/posts", {
          method: "PUT",
          headers: {
            cookie: "inmoment_admin=" + token,
            origin: "https://unrelated.example",
          },
          body: "{}",
        });
        assert.equal((await writeAdmin(req)).status, 403);
        assert.equal(
          guard(
            new NextRequest("http://localhost:3000/api/admin/posts", {
              headers: { cookie: "inmoment_admin=" + token },
            }),
          ),
          null,
        );
        process.env.ADMIN_SESSION_SECRET = randomBytes(32).toString("hex");
        assert.ok(!validSession(token));
      },
    );
    await t.test("SVG uploads and path traversal are rejected", async () => {
      const r = await upload(
        new NextRequest("http://localhost:3000/api/admin/upload", {
          method: "POST",
          headers: {
            cookie: "inmoment_admin=" + makeSession(),
            origin: "http://localhost:3000",
          },
          body: '<svg xmlns="http://www.w3.org/2000/svg"/>',
        }),
      );
      assert.equal(r.status, 400);
      const p = (await listPosts())[0];
      assert.ok(!postSchema.safeParse({ ...p, slug: "../escape" }).success);
      assert.ok(
        !postSchema.safeParse({ ...p, image: "/images/../../secret.png" })
          .success,
      );
    });
    await t.test("per-IP quota permits ten, rejects eleven, resets", () => {
      const ip = "test-bucket";
      for (let i = 0; i < 10; i++) assert.ok(botRateLimit(ip, 1000).allowed);
      assert.ok(!botRateLimit(ip, 1000).allowed);
      assert.ok(botRateLimit(ip, 62000).allowed);
    });
    await t.test("Markdown rendering blocks script and unsafe links", () => {
      const html = renderToStaticMarkup(
        createElement(BlogMarkdown, {
          body: "<script>alert(1)</script>\n\n[bad](javascript:alert)\n\n# Inner heading",
        }),
      );
      assert.ok(!html.includes("<script"));
      assert.ok(!html.includes('href="javascript:'));
      assert.ok(!html.includes("<h1"));
      assert.throws(
        () =>
          lexicalToMarkdown({
            root: { type: "root", children: [{ type: "block", fields: {} }] },
          }),
        /Unsupported/,
      );
    });
  } finally {
    if (resolve(dir).startsWith(resolve(tmpdir()) + require("node:path").sep))
      await rm(dir, { recursive: true, force: true });
  }
});
