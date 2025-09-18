import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Letters to fetch meals for
const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// Define meal type
interface Meal {
  external_id: string;
  name: string;
  image_url: string;
}

// Fetch meals for a single letter
async function fetchMeals(letter: string): Promise<Meal[]> {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return (data.meals ?? []).map((m: any) => ({
      external_id: m.idMeal,
      name: m.strMeal,
      image_url: m.strMealThumb,
    }));
  } catch (err) {
    console.error("Error fetching meals for letter", letter, err);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const key = req.headers.get("x-api-key") || body.key;

    // Fetch meals in parallel

    const results: Meal[][] = await Promise.all(letters.map(fetchMeals));

    const allMeals: Meal[] = results.flat();

    const { data, error } = (await supabase.from("meals").upsert(allMeals, {
      onConflict: "external_id",
    })) as { data: Meal[] | null; error: any };

    return NextResponse.json({
      success: true,
      inserted: data ? data.length : 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
