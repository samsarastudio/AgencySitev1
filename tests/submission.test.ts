import test from "node:test";
import assert from "node:assert/strict";
import { handleSubmission, allowAttempt } from "../lib/submit.ts";
const good = {
  name: "Test Person",
  email: "person@example.com",
  message: "A planned photo experience for a private test.",
  consent: true,
  startedAt: Date.now() - 5000,
};
function request(data: unknown, ip: string, origin = "http://localhost:3000") {
  return new Request("http://localhost:3000/api/inquiry", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
      origin,
    },
    body: JSON.stringify(data),
  });
}
test("server validates independently of the client", async () => {
  const r = await handleSubmission(
    request({ ...good, email: "bad" }, "validation"),
    "inquiry",
  );
  assert.equal(r.status, 422);
  assert.ok((await r.json()).errors.email);
});
test("unconfigured delivery never claims successful delivery", async () => {
  delete process.env.NEWSLETTER_WEBHOOK_URL;
  const r = await handleSubmission(request(good, "unconfigured"), "newsletter");
  assert.equal(r.status, 503);
  assert.match((await r.json()).message, /not been subscribed/);
});
test("cross-origin submissions are rejected", async () =>
  assert.equal(
    (
      await handleSubmission(
        request(good, "origin", "https://unrelated.example"),
        "inquiry",
      )
    ).status,
    403,
  ));
test("honeypot submission does not call provider", async () => {
  const r = await handleSubmission(
    request({ ...good, website: "spam.example" }, "honeypot"),
    "inquiry",
  );
  assert.equal(r.status, 200);
});
test("oversized input is rejected", async () => {
  const r = await handleSubmission(
    request({ ...good, message: "x".repeat(17000) }, "oversized"),
    "inquiry",
  );
  assert.equal(r.status, 413);
});
test("rate limit permits five requests and then recovers after window", () => {
  for (let n = 0; n < 5; n++)
    assert.equal(allowAttempt("rate-test", 1000), true);
  assert.equal(allowAttempt("rate-test", 1000), false);
  assert.equal(allowAttempt("rate-test", 700000), true);
});
test("provider failure and success produce distinct states", async () => {
  const original = globalThis.fetch;
  process.env.NEWSLETTER_WEBHOOK_URL = "https://provider.example/lead";
  try {
    globalThis.fetch = async () => new Response("", { status: 500 });
    assert.equal(
      (await handleSubmission(request(good, "failed-provider"), "newsletter"))
        .status,
      502,
    );
    globalThis.fetch = async () => new Response("", { status: 202 });
    const r = await handleSubmission(
      request(good, "success-provider"),
      "newsletter",
    );
    assert.equal(r.status, 200);
    assert.match((await r.json()).message, /received/);
  } finally {
    globalThis.fetch = original;
    delete process.env.NEWSLETTER_WEBHOOK_URL;
  }
});

test("enquiries persist privately without sending email and retries do not duplicate", async () => {
  const { mkdtemp, rm, writeFile } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join, resolve, sep } = await import("node:path");
  const { scryptSync } = await import("node:crypto");
  const { NextRequest } = await import("next/server");
  const { GET } = await import("../app/api/admin/inquiries/route");
  const { makeSession } = await import("../lib/admin-auth");
  const { listInquiries } = await import("../lib/inquiry-store");
  const dir = await mkdtemp(join(tmpdir(), "inmoment-inbox-test-"));
  const original = globalThis.fetch;
  process.env.INQUIRY_DATA_DIR = join(dir, "inquiries");
  process.env.ADMIN_PASSWORD_HASH =
    "abcd:" + scryptSync("test", "abcd", 64).toString("hex");
  process.env.ADMIN_SESSION_SECRET = "x".repeat(48);
  try {
    globalThis.fetch = async () => {
      throw new Error("Unexpected outbound request");
    };
    const first = await handleSubmission(
      request(good, "persist-one"),
      "inquiry",
    );
    assert.equal(first.status, 200);
    const result = await first.json();
    assert.match(result.message, /received/);
    const repeat = await handleSubmission(
      request(good, "persist-two"),
      "inquiry",
    );
    assert.equal((await repeat.json()).reference, result.reference);
    const items = await listInquiries();
    assert.equal(items.length, 1);
    assert.equal(items[0].message, good.message);
    assert.equal(items[0].email, good.email);
    assert.ok(!("startedAt" in items[0]));
    assert.equal(
      (await GET(new NextRequest("http://localhost:3000/api/admin/inquiries")))
        .status,
      401,
    );
    const admin = await GET(
      new NextRequest("http://localhost:3000/api/admin/inquiries", {
        headers: { cookie: "inmoment_admin=" + makeSession() },
      }),
    );
    assert.equal(admin.status, 200);
    assert.equal(admin.headers.get("cache-control"), "no-store");
    assert.equal((await admin.json()).inquiries.length, 1);
    const blocked = join(dir, "not-a-directory");
    await writeFile(blocked, "blocked");
    process.env.INQUIRY_DATA_DIR = blocked;
    const failure = await handleSubmission(
      request(good, "persist-failure"),
      "inquiry",
    );
    assert.equal(failure.status, 503);
    assert.match((await failure.json()).message, /could not save/);
  } finally {
    globalThis.fetch = original;
    delete process.env.INQUIRY_DATA_DIR;
    delete process.env.ADMIN_PASSWORD_HASH;
    delete process.env.ADMIN_SESSION_SECRET;
    if (resolve(dir).startsWith(resolve(tmpdir()) + sep))
      await rm(dir, { recursive: true, force: true });
  }
});
