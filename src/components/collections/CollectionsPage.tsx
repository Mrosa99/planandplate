"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollectionCard } from "./CollectionCard";

const PLACEHOLDER_COLLECTIONS = [
  {
    id: "1",
    name: "Weeknight Dinners",
    recipeCount: 12,
    coverImage: "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
  },
  {
    id: "2",
    name: "Meal Prep",
    recipeCount: 8,
    coverImage: "https://www.themealdb.com/images/media/meals/1520081754.jpg",
  },
  {
    id: "3",
    name: "Date Night",
    recipeCount: 5,
    coverImage: "https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg",
  },
];

export function CollectionsPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Collections</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Organise your saved recipes into groups.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" /> New Collection
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PLACEHOLDER_COLLECTIONS.map((col) => (
            <CollectionCard
              key={col.id}
              name={col.name}
              recipeCount={col.recipeCount}
              coverImage={col.coverImage}
              href={`/collections/${col.id}`}
            />
          ))}

          {/* Create new card */}
          <button className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card h-[11.5rem] gap-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            <Plus className="size-8" />
            <span className="text-sm font-medium">Create New Collection</span>
          </button>
        </div>

      </div>
    </main>
  );
}
