import { supabase } from "./supabase-client";
import { UserMeal } from "./types";

export async function fetchUserCreatedMeals(userId: string): Promise<UserMeal[]> {
  const { data, error } = await supabase
    .from("meals")
    .select("id_meal, name, image_url, is_public, categories(category), areas(area), ingredients(meal_id)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message ?? "Failed to fetch meals");

  return (data ?? []).map((m) => ({
    id_meal: m.id_meal,
    name: m.name,
    image_url: m.image_url || undefined,
    area: (m.areas as unknown as { area: string } | null)?.area ?? undefined,
    is_public: m.is_public ?? false,
    category: (m.categories as unknown as { category: string } | null)?.category,
    ingredientCount: Array.isArray(m.ingredients) ? m.ingredients.length : 0,
  }));
}

export async function toggleMealVisibility(mealId: string, isPublic: boolean): Promise<void> {
  const { error } = await supabase
    .from("meals")
    .update({ is_public: isPublic })
    .eq("id_meal", mealId);
  if (error) throw new Error(error.message ?? "Failed to update visibility");
}

export async function deleteUserMeal(mealId: string): Promise<void> {
  const { error } = await supabase.from("meals").delete().eq("id_meal", mealId);
  if (error) throw new Error(error.message ?? "Failed to delete meal");
}
