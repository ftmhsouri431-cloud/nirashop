import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  checkPassword,
  makeSessionToken,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const password = String(body.password || "");
  if (!(await checkPassword(password))) {
    return NextResponse.json({ error: "رمز عبور نادرست است" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    ADMIN_COOKIE,
    makeSessionToken(),
    adminCookieOptions(60 * 60 * 24 * 7),
  );
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", adminCookieOptions(0));
  return res;
}
