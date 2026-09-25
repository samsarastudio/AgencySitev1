import { inquirySchema, newsletterSchema, validateTiming } from "./inquiry";
const attempts = new Map<string, { count: number; until: number }>();
export function allowAttempt(key: string, now = Date.now()) {
  for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
  if (attempts.size > 10000) return false;
  const entry = attempts.get(key);
  if (!entry) {
    attempts.set(key, { count: 1, until: now + 600_000 });
    return true;
  }
  entry.count++;
  return entry.count <= 5;
}
export async function handleSubmission(
  request: Request,
  kind: "inquiry" | "newsletter",
) {
  const json = (body: object, status: number) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  const reqOrigin = request.headers.get("origin");
  const allowedOrigin =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  if (
    reqOrigin &&
    reqOrigin !== allowedOrigin &&
    !(
      process.env.NODE_ENV !== "production" &&
      reqOrigin === new URL(request.url).origin
    )
  )
    return json({ message: "Please submit from the website form." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ message: "Please use the website form." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 16000)
    return json(
      { message: "Your brief is too long. Please shorten it or email us." },
      413,
    );
  const key =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowAttempt(kind + ":" + key))
    return json(
      {
        message:
          "Too many attempts. Please wait a few minutes or email us directly.",
      },
      429,
    );
  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return json({ message: "Your brief is too long." }, 413);
    input = JSON.parse(raw);
  } catch {
    return json({ message: "We could not read that submission." }, 400);
  }
  const parsed = (
    kind === "inquiry" ? inquirySchema : newsletterSchema
  ).safeParse(input);
  if (!parsed.success)
    return json(
      {
        message: "Please check the highlighted fields.",
        errors: Object.fromEntries(
          parsed.error.issues.map((e) => [e.path[0], e.message]),
        ),
      },
      422,
    );
  const data = parsed.data;
  if (data.website) return json({ message: "Thank you." }, 200);
  if (!validateTiming(data.startedAt))
    return json(
      { message: "Please take a moment to review the form, then try again." },
      422,
    );
  const endpoint =
    kind === "inquiry"
      ? process.env.INQUIRY_WEBHOOK_URL
      : process.env.NEWSLETTER_WEBHOOK_URL;
  if (!endpoint)
    return json(
      {
        message:
          kind === "inquiry"
            ? "Online delivery is not connected yet. Your brief has not been sent. Please email hello@inmomentservices.com."
            : "Newsletter signup is not connected yet. Your email has not been subscribed.",
      },
      503,
    );
  try {
    const target = new URL(endpoint);
    if (target.protocol !== "https:") throw new Error("HTTPS required");
    const { website, startedAt, ...payload } = data;
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.FORM_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.FORM_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        kind,
        submittedAt: new Date().toISOString(),
        ...payload,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Delivery rejected");
    return json(
      {
        message:
          kind === "inquiry"
            ? "Your brief has been delivered. Thank you for sharing the idea."
            : "Your signup request has been received. Check your inbox for the next step.",
      },
      200,
    );
  } catch {
    return json(
      {
        message:
          "We could not confirm delivery. Your details remain in the form. Please try again or email hello@inmomentservices.com.",
      },
      502,
    );
  }
}
