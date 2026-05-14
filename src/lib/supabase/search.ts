import { supabase } from "./supabase-client";
import { MealData } from "./types";

export async function searchMeals(
  query: string,
  limit = 20,
  offset = 0,
): Promise<MealData[]> {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from("meals")
    .select("id_meal, name, image_url")
    .ilike("name", `%${query.trim()}%`)
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message ?? "Failed to search meals");

  return (data ?? []) as MealData[];
}
