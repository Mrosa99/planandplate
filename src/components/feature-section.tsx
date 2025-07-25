import MediaCard from "./ui/media-card";
import type { Meal } from "@/lib/fetch-meals";

interface FeatureSectionProps {
  meals: Meal[];
  reverse?: boolean;
}

const FeatureSection = ({ meals, reverse = false }: FeatureSectionProps) => {
  if (!meals || meals.length === 0) return null;
  const randomMeal = meals[Math.floor(Math.random() * meals.length)];
  const shuffledMeals = [...meals].sort(() => 0.5 - Math.random());
  const topThreeMeals = shuffledMeals.slice(0, 3);

  const content = (
    <div className="text-left mx-auto py-5">
      <div className="border-l-2 border-gray-300 pl-4 mb-8">
        <h2 className="text-xl lg:text-3xl font-bold mb-4">
          Ingredient Based Recipes
        </h2>
        <p>
          Find recipes tailored to the ingredients you already have at home.
        </p>
      </div>
      <div className="pl-4 mb-8">
        <h2 className="text-xl lg:text-3xl font-bold mb-4">
          Smart Meal Planning & Scheduling
        </h2>
        <p>Plan your weekly meals with ease.</p>
      </div>
      <div className="pl-4 mb-8">
        <h2 className="text-xl lg:text-3xl font-bold mb-4">
          Personalized Recipe Recommendations
        </h2>
        <p>Get suggestions based on your preferences.</p>
      </div>
    </div>
  );

  return (
    <section className="w-full h-[580px]">
      <div className="w-full grid grid-cols-2 h-full">
        {reverse ? (
          <>
            <div className="feature-content">{content}</div>
            <div className="feature-img">
              {/* Desktop: show 1 image */}
              <div className="hidden md:block">
                <MediaCard
                  image={randomMeal.strMealThumb}
                  title={randomMeal.strMeal}
                />
              </div>

              {/* Mobile: show 3 stacked images */}
              <div className="flex flex-col gap-4 md:hidden">
                {topThreeMeals.map((meal) => (
                  <MediaCard
                    key={meal.idMeal}
                    image={meal.strMealThumb}
                    title={meal.strMeal}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="feature-img">
              {/* Desktop: show 1 image */}
              <div className="hidden md:block">
                <MediaCard
                  image={randomMeal.strMealThumb}
                  title={randomMeal.strMeal}
                />
              </div>

              {/* Mobile: show 3 stacked images */}
              <div className="flex flex-col gap-4 md:hidden">
                {topThreeMeals.map((meal) => (
                  <MediaCard
                    key={meal.idMeal}
                    image={meal.strMealThumb}
                    title={meal.strMeal}
                  />
                ))}
              </div>
            </div>

            <div className="feature-content">{content}</div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeatureSection;
