export async function fetchMeals() {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?f=a",
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch meals");
  }

  const data = await res.json();
  return data.meals;
}
