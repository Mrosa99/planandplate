import Link from "next/link";
import { fetchMealData } from "@/lib/supabase/fetch-meals";
import { MealDetailData } from "@/lib/supabase/types";
import RecipePage from "@/components/meals/RecipePage";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MealDetailPage({ params }: Props) {
  const { id } = await params;

  let meal: MealDetailData | null = null;

  try {
    meal = await fetchMealData(id);
  } catch (err) {
    console.error("Error fetching meal:", err);
    return notFound();
  }

  if (!meal) return notFound();

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <Link
        href="/recipes"
        className="self-start mb-4 text-primary font-semibold hover:underline"
      >
        ← Back to Recipes
      </Link>

      <RecipePage meal={meal} />
    </div>
  );
}
