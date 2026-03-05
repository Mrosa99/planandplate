import { Card } from "./ui/card";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { MealData } from "@/lib/supabase/fetchMealsFromSupabase";

interface Props {
  meal: MealData;
}

const MealCard = ({ meal }: Props) => {
  return (
    <Link href={`/recipes/${meal.id_meal}`} className="block h-full">
      <Card className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 h-full flex flex-col ">
        {/* Meal Image */}
        {meal.image_url && (
          <div className="relative h-64 w-full">
            <Image
              src={meal.image_url}
              alt={meal.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl" />
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
