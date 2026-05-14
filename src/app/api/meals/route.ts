import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/supabase-client";

const RATE_LIMIT = 10;

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient(token);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Rate limit: max 10 meals per 24 hours
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("meals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);

  if ((count ?? 0) >= RATE_LIMIT) {
    return NextResponse.json(
      { error: `You've reached the limit of ${RATE_LIMIT} meals per day. Try again tomorrow.` },
      { status: 429 },
    );
  }

  const body = await req.json();
  const { name, image_url, category, area, instructions, ingredients, is_public } = body;

  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  // Upsert category if provided
  let id_category: string | undefined;
  if (category?.trim()) {
    const { data: catData } = await supabase
      .from("categories")
      .upsert({ category: category.trim() }, { onConflict: "category" })
      .select("id_category")
      .single();
    id_category = catData?.id_category;
  }

  // Upsert area if provided
  let id_area: string | undefined;
  if (area?.trim()) {
    const { data: areaData } = await supabase
      .from("areas")
      .upsert({ area: area.trim() }, { onConflict: "area" })
      .select("id_area")
      .single();
    id_area = areaData?.id_area;
  }

  // Insert meal — RLS INSERT policy enforces user_id = auth.uid()
  const { data: mealData, error: mealError } = await supabase
    .from("meals")
    .insert({
      user_id: user.id,
      name: name.trim(),
      image_url: image_url?.trim() || null,
      instructions: instructions?.trim() || null,
      id_area: id_area ?? null,
      id_category: id_category ?? null,
      is_public: is_public === true,
    })
    .select("id_meal")
    .single();

  if (mealError) return NextResponse.json({ error: mealError.message }, { status: 500 });

  // Insert ingredients
  const validIngredients = ((ingredients ?? []) as { name: string; measure?: string }[]).filter(
    (i) => i.name?.trim(),
  );
  if (validIngredients.length > 0) {
    const { error: ingError } = await supabase.from("ingredients").insert(
      validIngredients.map((i) => ({
        meal_id: mealData.id_meal,
        name: i.name.trim(),
        measure: i.measure?.trim() || null,
      })),
    );
    if (ingError) return NextResponse.json({ error: ingError.message }, { status: 500 });
  }

  return NextResponse.json({ id_meal: mealData.id_meal });
}
