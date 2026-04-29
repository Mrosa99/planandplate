"use client";

import { useCallback, useState } from "react";
import MealCard from "@/components/meals/MealCard";
import { fetchFavoritePagination, removeFavorite } from "@/lib/supabase/favorites";
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
import { useAuth } from "@/components/AuthProvider";

const FavoritesList = ({ userId }: { userId: string }) => {
  const fetchFn = useCallback(
    (limit: number, offset: number) => fetchFavoritePagination(userId, limit, offset),
    [userId],
  );

  const { items: meals, loading, hasMore, observerRef, removeItem } = useInfiniteScroll(fetchFn);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  async function handleUnfavorite(mealId: string) {
    setRemovingIds((prev) => new Set(prev).add(mealId));
    try {
      await removeFavorite(userId, mealId);
      setTimeout(() => removeItem((m) => m.id_meal === mealId), 300);
    } catch {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(mealId);
        return next;
      });
    }
  }

  return (
    <main className="min-h-screen text-white py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center">
          My Favorites
        </h1>

        {meals.length === 0 && !loading && (
          <p className="text-center text-muted-foreground">
            No favorites yet. Heart a meal on the recipes page to save it here.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {meals.map((meal) => (
            <div
              key={meal.id_meal}
              className={`transition-all duration-300 ${
                removingIds.has(meal.id_meal)
                  ? "opacity-0 scale-90 pointer-events-none"
                  : "opacity-100 scale-100"
              }`}
            >
              <MealCard
                meal={meal}
                isFavorited={true}
                onToggleFavorite={handleUnfavorite}
              />
            </div>
          ))}
        </div>

        <div ref={observerRef} className="h-10 mt-4 text-center">
          {loading && <p>Loading favorites...</p>}
          {!hasMore && meals.length > 0 && <p>All favorites loaded.</p>}
        </div>
      </div>
    </main>
  );
};

const FavoritesPage = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  if (!userId) {
    return (
      <main className="min-h-screen text-white py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center">
            My Favorites
          </h1>
        </div>
      </main>
    );
  }

  return <FavoritesList userId={userId} />;
};

export default FavoritesPage;
