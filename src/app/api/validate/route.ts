import { NextRequest, NextResponse } from "next/server";

console.log("Validate API loaded");

export async function POST(req: NextRequest) {
  console.log("POST /api/validate invoked");
  const body = await req.json();
  const key = req.headers.get("x-api-key") || body.key;

  console.log("Env secret:", process.env.MEAL_IMPORT_SECRET);
  console.log("Incoming key:", key);

  if (!key || key !== process.env.MEAL_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ success: true, message: "Key validated" });
}
