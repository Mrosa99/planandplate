import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { MealData } from "@/lib/supabase/types";

interface Props {
  meal: MealData;
  onUnfavorite?: (mealId: string) => void;
  onRemove?: (mealId: string) => void;
}

export function MealTileCard({ meal, onUnfavorite, onRemove }: Props) {
  return (
    <Link href={`/recipes/${meal.id_meal}`} className="relative block rounded-xl overflow-hidden h-[11.5rem] group">
      {meal.image_url ? (
        meal.image_url.startsWith("http")
          ? <Image src={meal.image_url} alt={meal.name} fill className="object-cover" />
          : <div className="absolute inset-0 bg-muted flex items-center justify-center"><span className="text-5xl select-none">{meal.image_url}</span></div>
      ) : (
        <div className="absolute inset-0 bg-muted flex items-center justify-center"><span className="text-muted-foreground/30 text-4xl select-none">🍽️</span></div>
      )}
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
      {onRemove && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(meal.id_meal); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-destructive/80 transition-colors"
          aria-label="Remove from collection"
        >
          <Trash2 className="size-4 text-white" />
        </button>
      )}
    </Link>
  );
}
