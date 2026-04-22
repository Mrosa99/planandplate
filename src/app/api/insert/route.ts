import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

interface Meal {
  external_id: string;
  name: string;
  image_url: string;
}

// Fetch for a single letter
async function fetchMeals(letter: string): Promise<Meal[]> {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch meals for letter ${letter}. Status: ${res.status}`,
      );
      return [];
    }

    const meals = (await res.json()).meals ?? [];

    return meals.map((m: Record<string, string>) => ({
      external_id: m.idMeal,
      name: m.strMeal,
      image_url: m.strMealThumb,
    }));
  } catch (err) {
    console.error(`Error fetching meals for letter ${letter}:`, err);
    return [];
  }
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  try {
    const key = req.headers.get("x-api-key");

    if (key !== process.env.MEAL_IMPORT_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Fetch all meals in parallel
    const results: Meal[][] = await Promise.all(letters.map(fetchMeals));
    const allMeals: Meal[] = results.flat();

    if (allMeals.length === 0) {
      return NextResponse.json({ success: false, message: "No meals fetched" });
    }

    // Insert into Supabase
    const { data, error } = (await supabase.from("meals").upsert(allMeals, {
      onConflict: "external_id",
    })) as { data: Meal[] | null; error: { message: string } | null };

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      inserted: data ? data.length : 0,
    });
  } catch (err: unknown) {
    console.error("Unexpected error inserting meals:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
