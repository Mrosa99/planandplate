import { supabase } from "./supabase-client";
import { CollectionItem } from "./types";

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

export async function deleteCollection(collectionId: string): Promise<void> {
  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId);

  if (error) throw new Error(error.message ?? "Failed to delete collection");
}
