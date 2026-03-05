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
  return (data ?? []) as MealData[];
}

export async function fetchRandomMeals(count: number): Promise<MealData[]> {
  const { data, error } = await supabase.rpc("get_random_meals", { count });

  if (error) throw new Error(error.message);

  return (data ?? []) as MealData[];
}

export async function fetchMealsPagination(
  limit = 20,
  offset = 0,
): Promise<MealData[]> {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Supabase fetchMeals error:", error);
    return [];
  }

  return data || [];
}
