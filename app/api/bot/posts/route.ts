import { NextRequest } from "next/server";
import { reply, limitedBody } from "@/lib/admin-auth";
import { listPosts, savePost } from "@/lib/blog-store";
import {
  botPostSchema,
  botSlug,
  validBotKey,
  botRateLimit,
  botClientIp,
} from "@/lib/bot-api";
import { markdownToLexical, lexicalToMarkdown } from "@/lib/bot-content";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const expected = process.env.BOT_API_HOST;
  if (!expected)
    return reply({ ok: false, error: "BOT_API_HOST is not configured." }, 503);
  let actual = "";
  try {
    actual = new URL("http://" + req.headers.get("host")).hostname;
  } catch {}
  if (actual !== expected.toLowerCase())
    return reply({ ok: false, error: "Not found." }, 404);
  if (!process.env.OPENCLAW_API_KEY || process.env.OPENCLAW_API_KEY.length < 32)
    return reply(
      { ok: false, error: "Bot publishing is not configured." },
      503,
    );
  if (!validBotKey(req.headers.get("authorization")))
    return reply({ ok: false, error: "Unauthorized." }, 401);
  const rate = botRateLimit(botClientIp(req.headers));
  if (!rate.allowed) {
    const r = reply(
      {
        ok: false,
        error: "Rate limit exceeded. Maximum 10 posts per minute per IP.",
      },
      429,
    );
    r.headers.set("Retry-After", String(rate.retryAfter));
    return r;
  }
  if (!req.headers.get("content-type")?.includes("application/json"))
    return reply(
      { ok: false, error: "Use Content-Type: application/json." },
      415,
    );
  try {
    const parsed = botPostSchema.safeParse(
      JSON.parse(Buffer.from(await limitedBody(req, 200000)).toString()),
    );
    if (!parsed.success)
      return reply(
        {
          ok: false,
          error: "Invalid post.",
          details: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        400,
      );
    const input = parsed.data,
      slug = input.slug || botSlug(input.title);
    if (!slug)
      return reply(
        {
          ok: false,
          error: "Provide a slug using lowercase English letters or numbers.",
        },
        400,
      );
    let body: string, contentLexical: Record<string, unknown>;
    try {
      body = input.content || lexicalToMarkdown(input.contentLexical);
      contentLexical = input.content
        ? markdownToLexical(input.content)
        : input.contentLexical!;
    } catch (e) {
      return reply({ ok: false, error: (e as Error).message }, 422);
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      const current = (await listPosts()).find((p) => p.slug === slug);
      const publishedAt =
        input.publishedAt || current?.publishedAt || new Date().toISOString();
      const post = {
        ...current,
        slug,
        title: input.title,
        description:
          input.excerpt ||
          current?.description ||
          body
            .replace(/[#*_`\[\]]/g, "")
            .replace(/\s+/g, " ")
            .slice(0, 300)
            .padEnd(10, "."),
        body,
        contentLexical,
        draft: input.status === "draft",
        publishedAt,
        published: publishedAt.slice(0, 10),
        updated: new Date().toISOString().slice(0, 10),
        category: input.category,
        tags: input.tags,
        author: input.author,
        metaDescription: input.metaDescription ?? current?.metaDescription,
        image: current?.image || "/images/ai-portrait-kiosk.webp",
        imageAlt: current?.imageAlt || "InMoment branded photo kiosk concept",
        imageCaption: current?.imageCaption || "Concept visualization",
      };
      try {
        const saved = await savePost(post, current?.revision ?? null);
        return reply(
          {
            ok: true,
            id: saved.id,
            slug: saved.slug,
            action: current ? "updated" : "created",
          },
          current ? 200 : 201,
        );
      } catch (e) {
        if ((e as Error).message === "CONFLICT" && attempt < 2) continue;
        throw e;
      }
    }
  } catch (e) {
    if ((e as Error).message === "TOO_LARGE")
      return reply({ ok: false, error: "Request is too large." }, 413);
    if (e instanceof SyntaxError)
      return reply({ ok: false, error: "Invalid JSON." }, 400);
    if ((e as Error).name === "ZodError")
      return reply({ ok: false, error: "Post fields failed validation." }, 400);
    return reply(
      {
        ok: false,
        error: "Could not save the post. Check blog storage on the server.",
      },
      500,
    );
  }
  return reply(
    { ok: false, error: "Post changed during save. Retry the request." },
    409,
  );
}
