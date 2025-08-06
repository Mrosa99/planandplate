import React from "react";
import { Meal } from "@/lib/fetch-meals";

interface Props {
  meal: Meal | null;
}

export const MealDetail = ({ meal }: Props) => {
  if (!meal) return <div>Meal not found.</div>;

  return (
    <div>
      <h1>{meal.strMeal}</h1>
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <p>{meal.strInstructions}</p>
    </div>
  );
};
