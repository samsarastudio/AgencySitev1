import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { randomBytes } from "node:crypto";
import { NextRequest } from "next/server";
test("native Payload CMS, enquiry storage and bot publishing", async () => {
  const dir = await mkdtemp(join(tmpdir(), "inmoment-payload-test-"));
  process.env.DATABASE_URI = "file:" + join(dir, "cms.db").replace(/\\/g, "/");
  delete process.env.CMS_SCHEMA_PUSH;
  process.env.PAYLOAD_SECRET = randomBytes(48).toString("hex");
  process.env.CMS_MEDIA_DIR = join(dir, "media");
  process.env.BOT_API_HOST = "localhost";
  process.env.OPENCLAW_API_KEY = randomBytes(32).toString("hex");
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  const { getCMS } = await import("../lib/cms");
  const cms = await getCMS();
  await cms.db.migrate();
  try {
    const { POST } = await import("../app/api/bot/posts/route");
    const { publicPosts } = await import("../lib/blog-store");
    const { handleSubmission } = await import("../lib/submit");
    const req = (body: unknown, key = process.env.OPENCLAW_API_KEY) =>
      new NextRequest("http://localhost:3000/api/bot/posts", {
        method: "POST",
        headers: {
          host: "localhost:3000",
          "content-type": "application/json",
          authorization: "Bearer " + key,
        },
        body: JSON.stringify(body),
      });
    const post = {
      title: "Payload article",
      content: "## Native editor\n\nContent published through the bot.",
      category: "trends",
    };
    assert.equal((await POST(req(post, "wrong"))).status, 401);
    const first = await POST(req(post));
    assert.equal(first.status, 200);
    const created = await first.json();
    assert.equal(created.action, "created");
    const updated = await POST(
      req({ ...post, slug: created.slug, title: "Updated title" }),
    );
    assert.equal((await updated.json()).id, created.id);
    assert.equal(
      (await publicPosts()).find((p) => p.slug === created.slug)?.title,
      "Updated title",
    );
    const stored = (
      await cms.find({
        collection: "posts",
        where: { slug: { equals: created.slug } },
        limit: 1,
      })
    ).docs[0];
    await cms.update({
      collection: "posts",
      id: stored.id,
      data: { status: "draft" },
    });
    assert.ok(!(await publicPosts()).some((p) => p.slug === created.slug));
    assert.equal(
      (await cms.find({ collection: "posts", overrideAccess: false }))
        .totalDocs,
      0,
    );
    await assert.rejects(() =>
      cms.findVersions({ collection: "posts", overrideAccess: false }),
    );
    await cms.update({
      collection: "posts",
      id: stored.id,
      data: { status: "published", publishedAt: "2099-01-01T00:00:00.000Z" },
    });
    assert.equal((await publicPosts()).length, 0);
    const inquiry = {
      name: "Private visitor",
      email: "visitor@example.com",
      message: "Please plan an AI photo experience for our event.",
      consent: true,
      startedAt: Date.now() - 5000,
    };
    const submit = () =>
      handleSubmission(
        new Request("http://localhost:3000/api/inquiry", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            origin: "http://localhost:3000",
          },
          body: JSON.stringify(inquiry),
        }),
        "inquiry",
      );
    assert.equal((await submit()).status, 200);
    assert.equal((await submit()).status, 200);
    assert.equal((await cms.count({ collection: "enquiries" })).totalDocs, 1);
    await assert.rejects(() =>
      cms.find({ collection: "enquiries", overrideAccess: false }),
    );
    await assert.rejects(() =>
      cms.create({
        collection: "enquiries",
        data: {
          ...inquiry,
          submissionId: "unauthorized",
          receivedAt: new Date().toISOString(),
        },
        overrideAccess: false,
      }),
    );
    const admin = await cms.create({
      collection: "users",
      data: {
        email: "admin@example.com",
        password: "a-strong-local-test-password",
      },
    });
    const login = await cms.login({
      collection: "users",
      data: {
        email: "admin@example.com",
        password: "a-strong-local-test-password",
      },
    });
    assert.ok(login.token);
    const inbox = await cms.find({
      collection: "enquiries",
      overrideAccess: false,
      user: admin,
    });
    assert.equal(inbox.docs[0].message, inquiry.message);
    await cms.update({
      collection: "enquiries",
      id: inbox.docs[0].id,
      data: { status: "contacted", notes: "Reviewed in admin" },
      overrideAccess: false,
      user: admin,
    });
    assert.equal(
      (await cms.findByID({ collection: "enquiries", id: inbox.docs[0].id }))
        .status,
      "contacted",
    );
  } finally {
    await cms.destroy();
    if (resolve(dir).startsWith(resolve(tmpdir()) + sep))
      await rm(dir, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100,
      }).catch((e: NodeJS.ErrnoException) => {
        if (e.code !== "EBUSY") throw e;
      });
  }
});
