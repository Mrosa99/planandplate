import { supabase } from "./supabase-client";
import { MealData } from "./types";

export async function addFavorite(
  userId: string,
  mealId: string,
): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, meal_id: mealId });

  if (error) throw new Error(error.message ?? "Failed to add favorite");
}

export async function removeFavorite(
  userId: string,
  mealId: string,
): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("meal_id", mealId);

  if (error) throw new Error(error.message ?? "Failed to remove favorite");
}

export async function fetchFavoriteMealIds(
  userId: string,
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("favorites")
    .select("meal_id")
    .eq("user_id", userId);

  if (error)
    throw new Error(error.message ?? "Failed to fetch favorite meal IDs");

  return new Set(data.map((row) => row.meal_id));
}

export async function fetchFavoritePagination(
  userId: string,
  limit = 20,
  offset = 0,
): Promise<MealData[]> {
  const { data: favs, error: favErr } = await supabase
    .from("favorites")
    .select("meal_id")
    .eq("user_id", userId)
    .range(offset, offset + limit - 1);

  if (favErr) throw new Error(favErr.message ?? "Failed to fetch favorites");
  if (!favs || favs.length === 0) return [];

  const mealIds = favs.map((f) => f.meal_id);

  const { data: meals, error: mealsErr } = await supabase
    .from("meals")
    .select("*")
    .in("id_meal", mealIds);

  if (mealsErr) throw new Error(mealsErr.message ?? "Failed to fetch meal details");
  return (meals ?? []) as MealData[];
}
