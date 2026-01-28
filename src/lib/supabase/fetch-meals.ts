import { supabase } from "./supabaseClient";

interface mealData {
  id_meal: number;
  name: string;
  image_url: string;
}

export async function fetchMeals() {
  const { data, error } = await supabase.from("meals").select("name");

  if (error) {
    throw new Error(error.message ?? "Failed to fetch meals");
  }

  console.log(data);
}

(async () => {
  try {
    const meals = await fetchMeals();
    console.log("Fetched meals:", meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
  }
})();
