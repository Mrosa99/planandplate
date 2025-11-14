"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import MediaCard from "./media-card";
import type { Meal } from "@/lib/supabase/fetch-meals";

interface MarqueeProps {
  meals: Meal[];
  direction?: "left" | "right";
}

export default function MealsMarquee({
  meals,
  direction = "left",
}: MarqueeProps) {
  return (
    <div>
      <Marquee
        pauseOnHover
        direction={direction}
        gradient={true}
        gradientColor="rgb(23, 23, 23)"
        gradientWidth={75}
      >
        {meals.map((meal: any) => (
          <MediaCard
            key={meal.idMeal}
            image={meal.strMealThumb}
            title={meal.strMeal}
          />
        ))}
      </Marquee>
    </div>
  );
}
