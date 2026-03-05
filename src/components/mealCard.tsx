import { Card } from "./ui/card";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { MealData } from "@/lib/supabase/fetchMealsFromSupabase";

interface Props {
  meals: MealData;
}

export const MealCard = ({ meals }: Props) => {
  return (
    <Link href={`/recipes/${meals.id_meal}`} className="block h-full">
      <Card className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
        {/* Meal Image with gradient overlay */}
        {meals.image_url && (
          <div className="relative h-64 w-full">
            <Image
              src={meals.image_url}
              alt={meals.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl" />
          </div>
        )}

        {/* Card Header with Title */}
        <CardHeader className="absolute bottom-0 w-full p-4">
          <CardTitle className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
            {meals.name}
          </CardTitle>
        </CardHeader>

        {/* Card Content with Button */}
        <CardContent className="mt-auto p-4 flex justify-end"></CardContent>
      </Card>
    </Link>
  );
};
