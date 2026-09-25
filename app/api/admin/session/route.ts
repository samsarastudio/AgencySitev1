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
    authenticated: validSession(req.cookies.get(cookieName)?.value),
  });
}
export async function POST(req: NextRequest) {
  if (!configured())
    return reply(
      {
        error:
          "Sign-in is temporarily unavailable. Please contact the site administrator.",
      },
      503,
    );
  if (!originAllowed(req))
    return reply(
      {
        error: "Sign-in could not be completed from this address.",
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
