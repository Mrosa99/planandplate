"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MealCard from "@/components/meals/MealCard";
import { fetchMealsByCategory } from "@/lib/supabase/fetch-meals";
import { fetchCategories } from "@/lib/supabase/fetch-options";
import { fetchFavoriteMealIds, addFavorite, removeFavorite } from "@/lib/supabase/favorites";
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
import { useAuth } from "@/components/AuthProvider";
import { CategoryOption } from "@/lib/supabase/fetch-options";
import { toast } from "sonner";

function CategoriesContent() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());

  const selectedId = searchParams.get("cat") ?? "";
  const selectedCategory = categories.find((c) => c.id_category === selectedId);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchFavoriteMealIds(userId).then(setFavoritedIds).catch(() => {});
  }, [userId]);

  const fetchFn = useCallback(
    (limit: number, offset: number) =>
      selectedId
        ? fetchMealsByCategory(selectedId, limit, offset)
        : Promise.resolve([]),
    [selectedId],
  );

  const { items: meals, loading, observerRef, reset } = useInfiniteScroll(fetchFn);

  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

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

  function selectCategory(id: string) {
    router.push(`/categories?cat=${id}`);
  }

  return (
    <main className="min-h-screen py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center">
          Categories
        </h1>

        {/* Category grid */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id_category}
              onClick={() => selectCategory(cat.id_category)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors
                ${selectedId === cat.id_category
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
                }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Meal grid */}
        {selectedId ? (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {selectedCategory?.category ?? ""}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {meals.map((meal) => (
                <MealCard
                  key={meal.id_meal}
                  meal={meal}
                  isFavorited={favoritedIds.has(meal.id_meal)}
                  onToggleFavorite={userId ? handleToggleFavorite : undefined}
                />
              ))}
            </div>
            <div ref={observerRef} className="h-10 mt-4 text-center">
              {loading && <p>Loading more recipes...</p>}
              {!loading && meals.length === 0 && (
                <p className="text-muted-foreground mt-12">No recipes found in this category.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground mt-4">
            Select a category to browse recipes.
          </p>
        )}
      </div>
    </main>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoriesContent />
    </Suspense>
  );
}
