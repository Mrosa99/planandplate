import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/supabase-client";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient(token);

  const [{ data: categories, error: catErr }, { data: areas, error: areaErr }] = await Promise.all([
    supabase.from("categories").select("id_category, category").order("category"),
    supabase.from("areas").select("id_area, area, code").order("area"),
  ]);

  if (catErr || areaErr) {
    return NextResponse.json({ error: "Failed to fetch options" }, { status: 500 });
  }

  return NextResponse.json({
    categories: categories ?? [],
    areas: areas ?? [],
  });
}
