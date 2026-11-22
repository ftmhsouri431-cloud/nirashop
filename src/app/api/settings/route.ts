import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getPublicSettings, updateSettings } from "@/lib/settings";

export const runtime = "nodejs";

export async function GET() {
  const settings = await getPublicSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const body = await req.json();
  const settings = await updateSettings({
    shopName: body.shopName,
    tagline: body.tagline,
    adminPassword: body.adminPassword,
  });
  return NextResponse.json({ settings });
}
