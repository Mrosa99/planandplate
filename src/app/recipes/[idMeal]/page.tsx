import { MealDetail } from "@/components/meal-detail";
import { fetchMealsById } from "@/lib/fetch-meals";

export default async function MealPage({
  params,
}: {
  params: { idMeal: string };
}) {
  const { idMeal } = await params;

  const meal = await fetchMealsById(idMeal);

  if (!meal) {
    return <div>Meal not found.</div>;
  }

  return <MealDetail meal={meal} />;
}
