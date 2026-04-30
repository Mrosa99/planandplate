import Link from "next/link";
import Image from "next/image";
import { FolderHeart, Trash2 } from "lucide-react";

interface CollectionCardProps {
  name: string;
  recipeCount: number;
  coverImage?: string;
  href: string;
  onDelete?: () => void;
}

export function CollectionCard({ name, recipeCount, coverImage, href, onDelete }: CollectionCardProps) {
  return (
    <div className="relative">
    <Link
      href={href}
      className="group flex flex-col rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Cover image / fallback */}
      <div className="relative h-40 w-full bg-muted flex items-center justify-center">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <FolderHeart className="size-12 text-muted-foreground/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Info */}
      <div className="px-4 py-3">
        <p className="font-semibold text-sm truncate">{name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {recipeCount} {recipeCount === 1 ? "recipe" : "recipes"}
        </p>
      </div>
    </Link>
    {onDelete && (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-md"
        aria-label="Delete collection"
      >
        <Trash2 className="size-4" />
      </button>
    )}
    </div>
  );
}
