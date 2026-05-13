import { supabase } from "./supabase-client";
import { MealData, MealDetailData } from "./types";


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
    .eq("is_public", true)
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Supabase fetchMeals error:", error);
    return [];
  }

  return data || [];
}

export async function fetchMealData(id: string): Promise<MealDetailData | null> {
  const { data, error } = await supabase
    .from("meals")
    .select("*, categories(category), areas(area), ingredients(name, measure)")
    .eq("id_meal", id)
    .single();

  if (error) {
    console.error("Supabase fetchMealDetails error:", error);
    return null;
  }

  return data as MealDetailData | null;
}
