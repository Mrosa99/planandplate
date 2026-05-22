"use server";

import { unstable_cache } from "next/cache";
import { searchMeals } from "@/lib/supabase/search";
import { MealData } from "@/lib/supabase/types";

export const searchMealsCached = unstable_cache(
  async (query: string, limit: number, offset: number): Promise<MealData[]> =>
    searchMeals(query, limit, offset),
  ["search-meals"],
  { revalidate: 300 },
);
