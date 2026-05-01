import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RATE_LIMIT = 10;

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_ROLE_KEY!,
  );
  const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

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
  const { name, image_url, category, area, instructions, ingredients } = body;

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

  // Insert meal
  const { data: mealData, error: mealError } = await supabase
    .from("meals")
    .insert({
      user_id: user.id,
      name: name.trim(),
      image_url: image_url?.trim() || null,
      instructions: instructions?.trim() || null,
      area: area?.trim() || null,
      id_category: id_category ?? null,
      is_public: false,
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
