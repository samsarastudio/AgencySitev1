import { NextRequest } from "next/server";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { blogDirectory } from "@/lib/blog-store";
import { guard, reply, limitedBody } from "@/lib/admin-auth";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const denied = guard(req, true);
  if (denied) return denied;
  try {
    const raw = await limitedBody(req, 8 * 1024 * 1024);
    const decoder = sharp(raw, { limitInputPixels: 25000000 });
    const info = await decoder.metadata();
    if (!["jpeg", "png", "webp"].includes(info.format || ""))
      return reply({ error: "Choose a JPEG, PNG or WebP image." }, 400);
    const bytes = await decoder
      .rotate()
      .resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();
    const dir = join(blogDirectory(), "media");
    await mkdir(dir, { recursive: true });
    const name = randomUUID() + ".webp";
    await writeFile(join(dir, name), bytes, { flag: "wx", mode: 0o600 });
    return reply({ url: "/api/blog-media/" + name });
  } catch (e) {
    return reply(
      {
        error:
          (e as Error).message === "TOO_LARGE"
            ? "Image must be under 8 MB."
            : "Could not process this image. Use a JPEG, PNG or WebP under 25 megapixels.",
      },
      400,
    );
  }
}
