"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import MealCard from "@/components/meals/MealCard";
import { fetchMealsPagination, fetchTrendingMeals } from "@/lib/supabase/fetch-meals";
import { fetchFavoriteMealIds, addFavorite, removeFavorite } from "@/lib/supabase/favorites";
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
import { useAuth } from "@/components/AuthProvider";

type SortKey = "latest" | "most_saved" | "trending";

const SORT_LABELS: Record<SortKey, string> = {
  latest: "New Recipes",
  most_saved: "Most Saved",
  trending: "Trending",
};

function RecipesContent() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const searchParams = useSearchParams();

  const rawSort = searchParams.get("sort") ?? "latest";
  const sort: SortKey = rawSort === "trending" || rawSort === "most_saved" ? rawSort : "latest";

  const fetchFn = useCallback(
    (limit: number, offset: number) =>
      sort === "trending"
        ? fetchTrendingMeals(limit, offset)
        : fetchMealsPagination(limit, offset, sort),
    [sort],
  );

  const { items: meals, loading, hasMore, observerRef, reset } = useInfiniteScroll(fetchFn);

  useEffect(() => {
    reset();
  // reset is stable (useCallback with no deps), sort drives the re-fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    fetchFavoriteMealIds(userId).then(setFavoritedIds).catch(() => {});
  }, [userId]);

  async function handleToggleFavorite(mealId: string) {
    if (!userId) return;
    const isFav = favoritedIds.has(mealId);

    setFavoritedIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(mealId) : next.add(mealId);
      return next;
    });

    try {
      isFav ? await removeFavorite(userId, mealId) : await addFavorite(userId, mealId);
    } catch {
      toast.error(isFav ? "Failed to remove from favorites" : "Failed to save to favorites");
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(mealId) : next.delete(mealId);
        return next;
      });
    }
  }

  const title = sort === "latest" ? "All Recipes" : SORT_LABELS[sort];

  return (
    <main className="min-h-screen text-white py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center">
          {title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {meals.map((meal) => (
            <MealCard
              key={meal.id_meal}
              meal={meal}
              isFavorited={favoritedIds.has(meal.id_meal)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>

        <div ref={observerRef} className="h-10 mt-4 text-center">
          {loading && <p>Loading more recipes...</p>}
          {!loading && meals.length === 0 && (
            <p className="text-muted-foreground mt-12">No recipes found.</p>
          )}
        </div>
      </div>
    </main>
  );
}

const RecipesPage = () => (
  <Suspense>
    <RecipesContent />
  </Suspense>
);

export default RecipesPage;
