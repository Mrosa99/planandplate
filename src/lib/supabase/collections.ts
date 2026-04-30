import { supabase } from "./supabase-client";
import { CollectionItem, MealData } from "./types";

export async function fetchCollections(userId: string): Promise<CollectionItem[]> {
  const { data, error } = await supabase
    .from("collections")
    .select(`
      id,
      name,
      collection_meals(added_at, meals(image_url))
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message ?? "Failed to fetch collections");

  return (data ?? []).map((col) => {
    const meals = (col.collection_meals as unknown as { added_at: string; meals: { image_url: string } | null }[]);
    const sorted = [...meals].sort(
      (a, b) => new Date(a.added_at).getTime() - new Date(b.added_at).getTime(),
    );
    return {
      id: col.id,
      name: col.name,
      recipeCount: meals.length,
      coverImage: sorted[0]?.meals?.image_url,
    };
  });
}

export async function createCollection(
  userId: string,
  name: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("collections")
    .insert({ user_id: userId, name })
    .select("id")
    .single();

  if (error) throw new Error(error.message ?? "Failed to create collection");
  return data.id;
}

export async function fetchCollectionMeals(
  collectionId: string,
  limit = 20,
  offset = 0,
): Promise<MealData[]> {
  const { data, error } = await supabase
    .from("collection_meals")
    .select("meals(id_meal, name, image_url)")
    .eq("collection_id", collectionId)
    .order("added_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message ?? "Failed to fetch collection meals");

  return (data ?? [])
    .map((row) => row.meals as unknown as MealData)
    .filter(Boolean);
}

export async function addMealToCollection(
  collectionId: string,
  mealId: string,
): Promise<void> {
  const { error } = await supabase
    .from("collection_meals")
    .insert({ collection_id: collectionId, meal_id: mealId });

  if (error) throw new Error(error.message ?? "Failed to add meal to collection");
}

export async function deleteCollection(collectionId: string): Promise<void> {
  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId);

  if (error) throw new Error(error.message ?? "Failed to delete collection");
}
