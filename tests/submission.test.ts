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
  delete process.env.INQUIRY_WEBHOOK_URL;
  const r = await handleSubmission(request(good, "unconfigured"), "inquiry");
  assert.equal(r.status, 503);
  assert.match((await r.json()).message, /not been sent/);
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
  process.env.INQUIRY_WEBHOOK_URL = "https://provider.example/lead";
  try {
    globalThis.fetch = async () => new Response("", { status: 500 });
    assert.equal(
      (await handleSubmission(request(good, "failed-provider"), "inquiry"))
        .status,
      502,
    );
    globalThis.fetch = async () => new Response("", { status: 202 });
    const r = await handleSubmission(
      request(good, "success-provider"),
      "inquiry",
    );
    assert.equal(r.status, 200);
    assert.match((await r.json()).message, /delivered/);
  } finally {
    globalThis.fetch = original;
    delete process.env.INQUIRY_WEBHOOK_URL;
  }
});
