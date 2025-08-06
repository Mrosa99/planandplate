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
