"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MealCard from "@/components/meals/MealCard";
import { useSearch } from "@/lib/hooks/use-search";
import { useAuth } from "@/components/AuthProvider";
import { fetchFavoriteMealIds, addFavorite, removeFavorite } from "@/lib/supabase/favorites";

export function SearchPage() {
  const { session } = useAuth();
  const userId = session?.user.id;

  const [query, setQuery] = useState("");
  const { items: meals, loading, observerRef } = useSearch(query);
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
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(mealId) : next.delete(mealId);
        return next;
      });
    }
  }

  return (
    <main className="min-h-screen py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center">
          Search Recipes
        </h1>

        <div className="relative max-w-xl mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search for a meal..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {!query && (
          <p className="text-center text-muted-foreground">
            Start typing to search for meals.
          </p>
        )}

        {query && !loading && meals.length === 0 && (
          <p className="text-center text-muted-foreground">
            No results for &ldquo;{query}&rdquo;.
          </p>
        )}

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
          {loading && query && <p className="text-muted-foreground text-sm">Searching...</p>}
        </div>
      </div>
    </main>
  );
}
