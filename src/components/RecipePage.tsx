import React from "react";
import { MealData } from "@/lib/supabase/fetchMealsFromSupabase";

interface Props {
  meal: MealData;
}

export default function RecipePage({ meal }: Props) {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 flex flex-col gap-10">
      {/* Recipe Title */}
      <h1 className="text-5xl font-bold text-primary">{meal.name}</h1>

      {/* Hero Image */}
      <div className="w-full rounded-xl overflow-hidden shadow-md">
        <img
          src={meal.image_url}
          alt={meal.name}
          className="w-full h-[500px] object-cover"
        />
      </div>

      {/* Main content: Description + Steps + Ingredients */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column: Description + Steps */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-sm text-gray-500">
              This is where the description of the recipe will go.
            </p>
          </section>

          {/* Steps / Instructions */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-500">
              <li>Step 1 (placeholder)</li>
              <li>Step 2 (placeholder)</li>
              <li>Step 3 (placeholder)</li>
            </ol>
          </section>
        </div>

        {/* Right column: Ingredients */}
        <div className="w-full md:w-1/3">
          <section>
            <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
              <li>Ingredient 1 (placeholder)</li>
              <li>Ingredient 2 (placeholder)</li>
              <li>Ingredient 3 (placeholder)</li>
              <li>Ingredient 4 (placeholder)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
