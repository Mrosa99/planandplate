"use client";

import React, { useEffect, useState, useRef } from "react";
import MealCard from "@/components/meals/MealCard";
import {
  MealData,
  fetchMealsPagination,
} from "@/lib/supabase/fetchMealsFromSupabase";

const PAGE_SIZE = 20;

const RecipesPage = () => {
  const [meals, setMeals] = useState<MealData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // Fetch meals per page
  const loadMeals = async () => {
    setLoading(true);
    const newMeals = await fetchMealsPagination(
      PAGE_SIZE,
      (page - 1) * PAGE_SIZE,
    );
    if (newMeals.length < PAGE_SIZE) setHasMore(false);
    setMeals((prev) => [...prev, ...newMeals]);
    setLoading(false);
  };

  // Initial + subsequent page fetch
  useEffect(() => {
    loadMeals();
  }, [page]);

  // IntersectionObserver triggers next page
  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <main className="min-h-screen text-white py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center">
          All Recipes
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {meals.map((meal) => (
            <MealCard key={meal.id_meal} meal={meal} />
          ))}
        </div>

        {/* Loader / trigger div */}
        <div ref={observerRef} className="h-10 mt-4 text-center">
          {loading && <p>Loading more meals...</p>}
          {!hasMore && <p>No more meals to load.</p>}
        </div>
      </div>
    </main>
  );
};

export default RecipesPage;
