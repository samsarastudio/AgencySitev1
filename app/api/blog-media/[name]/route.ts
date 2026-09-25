import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { blogDirectory } from "@/lib/blog-store";
export const runtime = "nodejs";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!/^[a-f0-9-]{36}\.webp$/.test(name))
    return new Response("Not found", { status: 404 });
  try {
    const bytes = await readFile(join(blogDirectory(), "media", name));
    return new Response(bytes, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
