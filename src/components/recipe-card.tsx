import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Meal } from "@/lib/fetch-meals";

interface Props {
  meals: Meal;
}

export const MealCard = ({ meals }: Props) => {
  return (
    <Link href={`/recipes/${meals.idMeal}`} className="block h-full">
      <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-200 gap-0">
        {meals.strMealThumb && meals.strMealThumb[0] && (
          <div className="relative h-60 w-full">
            <Image
              alt={meals.strMeal}
              src={meals.strMealThumb}
              fill
              className="group-hover:opacity-90 transition-opacity duration-300 rounded-t-lg"
            />
          </div>
        )}
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold text-white">
            {meals.strMeal}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <Button className="mt-4 bg-black text-white">View Details</Button>
        </CardContent>
      </Card>
    </Link>
  );
};
