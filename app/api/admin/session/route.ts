import { NextRequest } from "next/server";
import {
  configured,
  cookieName,
  validSession,
  originAllowed,
  loginAllowed,
  verifyPassword,
  makeSession,
  reply,
  limitedBody,
} from "@/lib/admin-auth";
export const runtime = "nodejs";
export function GET(req: NextRequest) {
  return reply({
    configured: configured(),
    authenticated: validSession(req.cookies.get(cookieName)?.value),
  });
}
export async function POST(req: NextRequest) {
  if (!configured())
    return reply(
      { error: "Run npm run admin:setup on the server, then restart the app." },
      503,
    );
  if (!originAllowed(req))
    return reply(
      {
        error:
          "Set ADMIN_ORIGIN to the exact HTTPS website address on the server.",
      },
      403,
    );
  if (!loginAllowed())
    return reply(
      { error: "Too many sign-in attempts. Try again in 15 minutes." },
      429,
    );
  try {
    const { password } = JSON.parse(
      Buffer.from(await limitedBody(req, 2048)).toString(),
    );
    if (typeof password !== "string" || !(await verifyPassword(password)))
      return reply({ error: "Password not accepted." }, 401);
    const response = reply({ authenticated: true });
    response.cookies.set(cookieName, makeSession(), {
      httpOnly: true,
      secure: (process.env.ADMIN_ORIGIN || req.nextUrl.origin).startsWith(
        "https:",
      ),
      sameSite: "strict",
      path: "/",
      maxAge: 12 * 3600,
    });
    return response;
  } catch {
    return reply({ error: "Invalid sign-in request." }, 400);
  }
}
export function DELETE(req: NextRequest) {
  if (!originAllowed(req))
    return reply({ error: "Request origin was not accepted." }, 403);
  const r = reply({ authenticated: false });
  r.cookies.set(cookieName, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
  });
  return r;
}
