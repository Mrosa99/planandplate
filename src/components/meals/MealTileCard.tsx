import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { MealData } from "@/lib/supabase/types";

interface Props {
  meal: MealData;
  onUnfavorite?: (mealId: string) => void;
}

export function MealTileCard({ meal, onUnfavorite }: Props) {
  return (
    <Link href={`/recipes/${meal.id_meal}`} className="relative block rounded-xl overflow-hidden h-[11.5rem] group">
      <Image src={meal.image_url} alt={meal.name} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <p className="absolute bottom-3 left-3 right-8 text-sm font-semibold text-white truncate">
        {meal.name}
      </p>
      {onUnfavorite && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUnfavorite(meal.id_meal); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          aria-label="Remove from favorites"
        >
          <Heart className="size-4 text-white" fill="currentColor" />
        </button>
      )}
    </Link>
  );
}
