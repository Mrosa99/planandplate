import React from "react";
import Marquee from "react-fast-marquee";
import MediaCard from "./media-card";
import { fetchMeals } from "@/lib/fetch-meals";

interface MarqueeProps {
  direction?: "left" | "right";
}

export default async function MealsMarquee({
  direction = "left",
}: MarqueeProps) {
  const meals = await fetchMeals();

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
