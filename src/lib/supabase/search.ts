import { supabase } from "./supabase-client";
import { MealData } from "./types";

const cache = new Map<string, MealData[]>();
const CACHE_MAX = 100;

export async function searchMeals(
  query: string,
  limit = 20,
  offset = 0,
): Promise<MealData[]> {
  if (!query.trim()) return [];

  const key = `${query.trim().toLowerCase()}:${limit}:${offset}`;
  if (cache.has(key)) return cache.get(key)!;

  const { data, error } = await supabase
    .from("meals")
    .select("id_meal, name, image_url")
    .ilike("name", `%${query.trim()}%`)
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message ?? "Failed to search meals");

  const results = (data ?? []) as MealData[];

  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!);
  cache.set(key, results);

  return results;
}
