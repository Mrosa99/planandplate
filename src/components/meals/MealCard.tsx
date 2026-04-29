import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { MealData } from "@/lib/supabase/types";

interface Props {
  meal: MealData;
  isFavorited?: boolean;
  onToggleFavorite?: (mealId: string) => void;
}

const MealCard = ({ meal, isFavorited, onToggleFavorite }: Props) => {
  return (
    <Link href={`/recipes/${meal.id_meal}`} className="block h-full">
      <Card className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 h-full flex flex-col">
        {/* Meal Image */}
        {meal.image_url && (
          <div className="relative h-64 w-full">
            <Image
              src={meal.image_url}
              alt={meal.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent rounded-t-2xl" />

            {/* Heart button */}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(meal.id_meal);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className="size-5"
                  fill={isFavorited ? "currentColor" : "none"}
                  color="white"
                />
              </button>
            )}
          </div>
        )}

        {/* Meal Title */}
        <CardHeader className="absolute bottom-0 w-full p-4">
          <CardTitle className="text-lg sm:text-xl font-bold text-white drop-shadow-md truncate">
            {meal.name}
          </CardTitle>
        </CardHeader>

        {/* Optional Button */}
        <CardContent className="mt-auto p-4 flex justify-end"></CardContent>
      </Card>
    </Link>
  );
};

export default MealCard;
