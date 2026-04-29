"use client";

import { useEffect, useState, useCallback } from "react";
import MealCard from "@/components/meals/MealCard";
import { fetchMealsPagination } from "@/lib/supabase/fetch-meals";
import { fetchFavoriteMealIds, addFavorite, removeFavorite } from "@/lib/supabase/favorites";
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
import { useAuth } from "@/components/AuthProvider";

const RecipesPage = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  const fetchFn = useCallback(
    (limit: number, offset: number) => fetchMealsPagination(limit, offset),
    [],
  );

  const { items: meals, loading, hasMore, observerRef } = useInfiniteScroll(fetchFn);

  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    fetchFavoriteMealIds(userId)
      .then(setFavoritedIds)
      .catch(() => {});
  }, [userId]);

  async function handleToggleFavorite(mealId: string) {
    if (!userId) return;
    const isFav = favoritedIds.has(mealId);

    // Optimistic update
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(mealId) : next.add(mealId);
      return next;
    });

    try {
      isFav
        ? await removeFavorite(userId, mealId)
        : await addFavorite(userId, mealId);
    } catch {
      // Revert on failure
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(mealId) : next.delete(mealId);
        return next;
      });
    }
  }

  return (
    <main className="min-h-screen text-white py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center">
          All Recipes
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
          {loading && <p>Loading more meals...</p>}
          {!hasMore && <p>No more meals to load.</p>}
        </div>
      </div>
    </main>
  );
};

export default RecipesPage;
