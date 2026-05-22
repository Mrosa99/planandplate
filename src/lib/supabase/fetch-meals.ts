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
  sort: "latest" | "most_saved" = "latest",
): Promise<MealData[]> {
  const column = sort === "most_saved" ? "save_count" : "created_at";
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("is_public", true)
    .order(column, { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message ?? "Failed to fetch meals");

  return data || [];
}

export async function fetchTrendingMeals(limit: number, offset: number): Promise<MealData[]> {
  const { data, error } = await supabase
    .rpc("get_trending_meals", { p_limit: limit, p_offset: offset });

  if (error) throw new Error(error.message ?? "Failed to fetch trending meals");

  return (data ?? []) as MealData[];
}

export async function fetchMealsByCategory(
  categoryId: string,
  limit = 20,
  offset = 0,
): Promise<MealData[]> {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("id_category", categoryId)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message ?? "Failed to fetch meals by category");
  return data || [];
}

export async function fetchMealData(id: string): Promise<MealDetailData | null> {
  const { data, error } = await supabase
    .from("meals")
    .select("*, categories(category), areas(area), ingredients(name, measure)")
    .eq("id_meal", id)
    .single();

  if (error) throw new Error(error.message ?? "Failed to fetch meal details");

  return data as MealDetailData | null;
}
