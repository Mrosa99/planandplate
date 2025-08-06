import { MealsList } from "@/components/recipe-list";
import { fetchMealsByLetter } from "@/lib/fetch-meals";

export default async function ProductsPage() {
  const meals = await fetchMealsByLetter("b");

  return (
    <div className="pb-8">
      <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground text-center mb-8">
        All Products
      </h1>
      TEST
      <MealsList meals={meals} />
    </div>
  );
}
