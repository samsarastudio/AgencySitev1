import { NextRequest } from "next/server";
import { guard, reply, limitedBody } from "@/lib/admin-auth";
import { listPosts, savePost } from "@/lib/blog-store";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  const denied = guard(req);
  if (denied) return denied;
  try {
    return reply({ posts: await listPosts() });
  } catch {
    return reply(
      {
        error:
          "Could not read blog storage. Check server permissions and post files.",
      },
      500,
    );
  }
}
export async function PUT(req: NextRequest) {
  const denied = guard(req, true);
  if (denied) return denied;
  try {
    const input = JSON.parse(
      Buffer.from(await limitedBody(req, 150000)).toString(),
    );
    if (input.revision !== null && typeof input.revision !== "string")
      return reply({ error: "Missing version. Reload the post." }, 400);
    const post = await savePost(input.post, input.revision);
    return reply({ post });
  } catch (e) {
    if ((e as Error).message === "CONFLICT")
      return reply(
        {
          error:
            "This post changed in another window, or the URL is already used. Copy your changes, then reload before saving.",
        },
        409,
      );
    if ((e as Error).name === "ZodError")
      return reply(
        {
          error:
            "Check the title, description, date, image, alt text and body. Use Heading 2 or lower in the body.",
        },
        400,
      );
    if ((e as Error).message === "TOO_LARGE")
      return reply({ error: "Post exceeds the size limit." }, 413);
    return reply(
      {
        error:
          "Could not save. Your editor still contains your changes. Check the server storage.",
      },
      500,
    );
  }
}
