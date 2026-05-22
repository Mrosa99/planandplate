import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

interface RawMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  [key: string]: string;
}

interface MealRow {
  external_id: string;
  name: string;
  image_url: string;
  instructions: string;
  area: string;
  id_category?: string;
}

interface IngredientRow {
  meal_id: string;
  name: string;
  measure: string;
}

function extractIngredients(raw: RawMeal, mealId: string): IngredientRow[] {
  const ingredients: IngredientRow[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = raw[`strIngredient${i}`]?.trim();
    const measure = raw[`strMeasure${i}`]?.trim() ?? "";
    if (name) ingredients.push({ meal_id: mealId, name, measure });
  }
  return ingredients;
}

async function fetchRawMeals(letter: string): Promise<RawMeal[]> {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    return (await res.json()).meals ?? [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Fetch all raw meals from TheMealDB
    const results = await Promise.all(letters.map(fetchRawMeals));
    const allRaw: RawMeal[] = results.flat();

    if (allRaw.length === 0) {
      return NextResponse.json({ success: false, message: "No meals fetched" });
    }

    // 2. Upsert categories and build a name → id map
    const uniqueCategories = [
      ...new Set(allRaw.map((m) => m.strCategory).filter(Boolean)),
    ];
    const { data: categoryRows, error: catError } = await supabase
      .from("categories")
      .upsert(
        uniqueCategories.map((c) => ({ category: c })),
        { onConflict: "category" },
      )
      .select("id_category, category");

    if (catError) {
      return NextResponse.json(
        { success: false, error: catError.message },
        { status: 500 },
      );
    }

    const categoryMap = new Map(
      (categoryRows ?? []).map((r) => [r.category, r.id_category]),
    );

    // 3. Build meal rows
    const mealRows: MealRow[] = allRaw.map((m) => ({
      external_id: m.idMeal,
      name: m.strMeal,
      image_url: m.strMealThumb,
      instructions: m.strInstructions,
      area: m.strArea,
      id_category: categoryMap.get(m.strCategory),
    }));

    // 4. Upsert meals
    const { data: upsertedMeals, error: mealError } = await supabase
      .from("meals")
      .upsert(mealRows, { onConflict: "external_id" })
      .select("id_meal, external_id");

    if (mealError) {
      return NextResponse.json(
        { success: false, error: mealError.message },
        { status: 500 },
      );
    }

    // 5. Build external_id → id_meal map
    const mealIdMap = new Map(
      (upsertedMeals ?? []).map((r) => [r.external_id, r.id_meal]),
    );

    // 6. Build ingredient rows
    const allIngredients: IngredientRow[] = allRaw.flatMap((raw) => {
      const mealId = mealIdMap.get(raw.idMeal);
      return mealId ? extractIngredients(raw, mealId) : [];
    });

    // 7. Upsert ingredients (unique constraint on meal_id + name required in DB)
    const { error: ingError } = await supabase
      .from("ingredients")
      .upsert(allIngredients, { onConflict: "meal_id,name" });

    if (ingError) {
      return NextResponse.json(
        { success: false, error: ingError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      meals: mealRows.length,
      ingredients: allIngredients.length,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
