import { supabase } from "./supabaseClient";

export interface MealData {
  id_meal: number;
  name: string;
  image_url: string;
}

export async function fetchAllMeals(): Promise<MealData[]> {
  const { data, error } = await supabase.from("meals").select("*");

  if (error) {
    throw new Error(error.message ?? "Failed to fetch meals");
  }
  console.log("Fetched meals:", data);
  return (data ?? []) as MealData[];
}

export async function fetchRandomMeal(): Promise<MealData | null> {
  // 1️⃣ Fetch all IDs
  const { data: ids, error: idError } = await supabase
    .from("meals")
    .select("id_meal");

  if (idError) {
    throw new Error(idError.message ?? "Failed to fetch meal IDs");
  }

  if (!ids || ids.length === 0) return null;

  // 2️⃣ Pick a random ID in JS
  const randomIndex = Math.floor(Math.random() * ids.length);
  const randomId = ids[randomIndex].id_meal;

  // 3️⃣ Fetch the full meal
  const { data: meal, error } = await supabase
    .from("meals")
    .select("*")
    .eq("id_meal", randomId)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to fetch random meal");
  }

  return (meal ?? null) as MealData | null;
}
