import { supabase } from "./supabase-client";

export interface CategoryOption {
  id_category: string;
  category: string;
}

export interface AreaOption {
  id_area: string;
  area: string;
  code?: string | null;
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id_category, category")
    .order("category");
if (error) throw new Error(error.message);
  return (data ?? []) as CategoryOption[];
}

export async function fetchAreas(): Promise<AreaOption[]> {
  const { data, error } = await supabase
    .from("areas")
    .select("id_area, area, code")
    .order("area");
  if (error) throw new Error(error.message);
  return (data ?? []) as AreaOption[];
}
