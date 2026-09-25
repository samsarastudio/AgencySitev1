import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { NextRequest, NextResponse } from "next/server";
const derive = promisify(scrypt);
export const cookieName = "inmoment_admin";
export const configured = () =>
  /^[a-f0-9]+:[a-f0-9]{128}$/i.test(process.env.ADMIN_PASSWORD_HASH || "") &&
  (process.env.ADMIN_SESSION_SECRET?.length || 0) >= 32;
const signature = (value: string) =>
  createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "")
    .update(value)
    .digest("base64url");
export function makeSession() {
  const value = Buffer.from(
    JSON.stringify({
      exp: Date.now() + 12 * 3600000,
      nonce: randomBytes(24).toString("hex"),
    }),
  ).toString("base64url");
  return value + "." + signature(value);
}
export function validSession(token?: string) {
  if (!configured() || !token) return false;
  try {
    const [value, sig, ...extra] = token.split(".");
    const expected = signature(value);
    if (
      extra.length ||
      sig.length !== expected.length ||
      !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    )
      return false;
    const payload = JSON.parse(Buffer.from(value, "base64url").toString());
    return (
      typeof payload.exp === "number" &&
      payload.exp > Date.now() &&
      payload.exp <= Date.now() + 12 * 3600000
    );
  } catch {
    return false;
  }
}
export async function verifyPassword(password: string) {
  if (!configured() || password.length > 256) return false;
  try {
    const [salt, hash] = process.env.ADMIN_PASSWORD_HASH!.split(":");
    const expected = Buffer.from(hash, "hex");
    const actual = (await derive(password, salt, 64)) as Buffer;
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  } catch {
    return false;
  }
}
export const reply = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export function originAllowed(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  if (process.env.ADMIN_ORIGIN) return origin === process.env.ADMIN_ORIGIN;
  if (process.env.NODE_ENV === "production") return false;
  return (
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) &&
    origin === req.nextUrl.origin
  );
}
export function guard(req: NextRequest, mutation = false) {
  if (!validSession(req.cookies.get(cookieName)?.value))
    return reply({ error: "Please sign in." }, 401);
  if (mutation && !originAllowed(req))
    return reply({ error: "Request origin was not accepted." }, 403);
  return null;
}
// One Pi process; a global limit also prevents untrusted proxy headers bypassing it.
const attempts: number[] = [];
export function loginAllowed(now = Date.now()) {
  while (attempts.length && attempts[0] < now - 15 * 60000) attempts.shift();
  if (attempts.length >= 20) return false;
  attempts.push(now);
  return true;
}
export async function limitedBody(req: Request, max: number) {
  if (Number(req.headers.get("content-length")) > max)
    throw new Error("TOO_LARGE");
  const reader = req.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const r = await reader.read();
    if (r.done) break;
    size += r.value.length;
    if (size > max) {
      await reader.cancel();
      throw new Error("TOO_LARGE");
    }
    chunks.push(r.value);
  }
  return Buffer.concat(chunks);
}
