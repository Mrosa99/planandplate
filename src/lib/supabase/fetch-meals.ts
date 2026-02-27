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

export async function fetchRandomMeals(count: number): Promise<MealData[]> {
  const { data: ids, error: idError } = await supabase
    .from("meals")
    .select("id_meal");

  if (idError) throw new Error(idError.message);

  if (!ids || ids.length === 0) return [];

  // shuffle IDs and pick `count`
  const shuffled = ids.sort(() => 0.5 - Math.random()).slice(0, count);
  const mealIds = shuffled.map((m) => m.id_meal);

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .in("id_meal", mealIds);

  if (error) throw new Error(error.message);

  return data ?? [];
}
