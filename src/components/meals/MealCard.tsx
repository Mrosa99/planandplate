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
    <Link
      href={`/recipes/${meal.id_meal}`}
      className="relative block h-72 rounded-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
    >
      <Image
        src={meal.image_url}
        alt={meal.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      <p className="absolute bottom-3 left-3 right-10 text-sm font-bold text-white drop-shadow-md line-clamp-2">
        {meal.name}
      </p>

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
            className="size-5 text-white"
            fill={isFavorited ? "currentColor" : "none"}
          />
        </button>
      )}
    </Link>
  );
};

export default MealCard;
