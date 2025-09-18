import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const key = req.headers.get("x-api-key") || body.key;

  if (!key || key !== process.env.MEAL_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ success: true, message: "Key validated" });
}
