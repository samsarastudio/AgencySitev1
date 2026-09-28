import { NextResponse } from "next/server";
export const reply = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
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
