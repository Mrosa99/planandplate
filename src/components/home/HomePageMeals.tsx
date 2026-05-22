"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchRandomMeals } from "@/lib/supabase/fetch-meals";
import { MealData } from "@/lib/supabase/types";

export function HeroImage() {
  const [meal, setMeal] = useState<MealData | null>(null);

  useEffect(() => {
    fetchRandomMeals(1).then((meals) => setMeal(meals[0] ?? null)).catch(() => {});
  }, []);

  return (
    <div className="flex-1 relative w-full aspect-4/3 max-h-125 group overflow-hidden rounded-lg shadow-lg">
      {meal ? (
        <Image
          src={meal.image_url}
          alt={meal.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
      )}
    </div>
  );
}

const FEATURES = [
  { title: "Discover", desc: "Search meals by name, category, or first letter." },
  { title: "Favorites", desc: "Save your favorite meals and quickly access them anytime." },
  { title: "Plan", desc: "Organize your weekly meals and never wonder what's for dinner." },
];

export function FeatureCards() {
  const [meals, setMeals] = useState<MealData[]>([]);

  useEffect(() => {
    fetchRandomMeals(3).then(setMeals).catch(() => {});
  }, []);

  return (
    <section
      id="meals"
      className="w-full max-w-6xl py-16 grid grid-cols-1 sm:grid-cols-3 gap-8"
    >
      {FEATURES.map(({ title, desc }, i) => (
        <div
          key={title}
          className="group bg-gray-600 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 flex flex-col items-center text-center"
        >
          {meals[i] ? (
            <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-6">
              <Image
                src={meals[i].image_url}
                alt={meals[i].name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>
          ) : (
            <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-xl mb-6" />
          )}
          <h4 className="text-2xl font-semibold text-orange-700">{title}</h4>
          <p className="mt-3 text-white">{desc}</p>
        </div>
      ))}
    </section>
  );
}
