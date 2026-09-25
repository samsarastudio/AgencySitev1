import test from "node:test";
import assert from "node:assert/strict";
import {
  inquirySchema,
  newsletterSchema,
  validateTiming,
} from "../lib/inquiry.ts";
const good = {
  name: "Test Person",
  email: "person@example.com",
  message: "A photo experience for a small event.",
  consent: true,
  startedAt: Date.now() - 5000,
};
test("valid inquiry accepts the required fields", () =>
  assert.equal(inquirySchema.safeParse(good).success, true));
test("missing consent and malformed email are rejected", () => {
  assert.equal(
    inquirySchema.safeParse({ ...good, consent: false }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({ ...good, email: "invalid" }).success,
    false,
  );
});
test("oversized brief and too-short brief are rejected", () => {
  assert.equal(
    inquirySchema.safeParse({ ...good, message: "x".repeat(6001) }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({ ...good, message: "hi" }).success,
    false,
  );
});
test("submission timing excludes immediate and stale requests", () => {
  const now = Date.now();
  assert.equal(validateTiming(now, now), false);
  assert.equal(validateTiming(now - 5000, now), true);
  assert.equal(validateTiming(now - 90_000_000, now), false);
});
test("newsletter requires independent consent", () =>
  assert.equal(
    newsletterSchema.safeParse({
      email: "p@example.com",
      consent: false,
      startedAt: 0,
    }).success,
    false,
  ));
