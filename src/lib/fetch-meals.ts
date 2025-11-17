export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string | null;
}

export async function fetchMealsByLetter(letter: string): Promise<Meal[]> {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch meals");
  }

  const data = await res.json();
  return data.meals ?? [];
}

export async function fetchMealsById(id: string): Promise<Meal | null> {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch meals");
  }

  const data = await res.json();
  return data.meals?.[0] ?? null;
}
