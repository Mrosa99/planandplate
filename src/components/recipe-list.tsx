"use client";

import { Card } from "./ui/card";
import { useState } from "react";
import { Meal } from "@/lib/fetch-meals";
import { MealCard } from "./recipe-card";

interface Props {
  meals: Meal[];
}

export const MealsList = ({ meals }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredMeals = meals.filter((meal) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = meal.strMeal.toLowerCase().includes(term);
    const descriptionMatch = meal.strInstructions
      ? meal.strInstructions.toLowerCase().includes(term)
      : false;

    return nameMatch || descriptionMatch;
  });
  return (
    <div>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Products..."
          className="w-full max-w-md rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMeals.map((meals, key) => {
          return (
            <li key={key}>
              <MealCard meals={meals} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
