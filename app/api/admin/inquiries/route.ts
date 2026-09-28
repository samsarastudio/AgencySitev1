import { NextRequest } from "next/server";
import { guard, reply } from "@/lib/admin-auth";
import { listInquiries } from "@/lib/inquiry-store";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  const denied = guard(req);
  if (denied) return denied;
  try {
    return reply({ inquiries: await listInquiries() });
  } catch {
    return reply(
      { error: "Could not read enquiries. Check the server storage." },
      500,
    );
  }
}
