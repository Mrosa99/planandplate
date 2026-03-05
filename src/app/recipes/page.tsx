import { MealData, fetchAllMeals } from "@/lib/supabase/fetchMealsFromSupabase";
import { MealCard } from "@/components/mealCard";

export default async function RecipesPage() {
  const meals: MealData[] = await fetchAllMeals();

  return (
    <main className="min-h-screen text-white py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center">
          All Recipes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {meals.map((meal) => (
            <MealCard key={meal.id_meal} meals={meal} />
          ))}
        </div>
      </div>
    </main>
  );
}
