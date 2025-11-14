import { supabase } from "./supabaseClient";

interface mealData {
  id_meal: number;
  name: string;
  image_url: string;
}

export async function fetchMealImgs() {
  const { data, error } = await supabase.from("meals").select("*");

  if (error) {
    throw new Error(error.message ?? "Failed to fetch meals");
  }

  return data;
}
