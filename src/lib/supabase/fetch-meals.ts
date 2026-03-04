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
  const { data, error } = await supabase.rpc("get_random_meals", { count });

  if (error) throw new Error(error.message);

  return (data ?? []) as MealData[];
}
