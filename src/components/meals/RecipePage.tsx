import Image from "next/image";
import { MealDetailData } from "@/lib/supabase/types";
import { RecipeActions } from "@/components/meals/RecipeActions";

interface Props {
  meal: MealDetailData;
}

export default function RecipePage({ meal }: Props) {
  const rawLines = meal.instructions
    ?.split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !/^step\s*\d+\.?:?\s*$/i.test(s)) ?? [];

  const steps: { label?: string; text: string }[] = [];
  let i = 0;
  while (i < rawLines.length) {
    if (rawLines[i].endsWith(":") && i + 1 < rawLines.length) {
      steps.push({ label: rawLines[i], text: rawLines[i + 1] });
      i += 2;
    } else {
      steps.push({ text: rawLines[i] });
      i++;
    }
  }

  const category = meal.categories?.category;
  const area = meal.areas?.area;

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 flex flex-col gap-8">

      {/* Hero + title */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative w-full md:w-96 aspect-square shrink-0 rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
          {meal.image_url ? (
            <Image
              src={meal.image_url}
              alt={meal.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <span className="text-muted-foreground/30 text-6xl select-none">🍽️</span>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-wrap gap-2">
            {category && (
              <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {category}
              </span>
            )}
            {area && (
              <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border bg-muted text-muted-foreground">
                {area}
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">{meal.name}</h1>
          {meal.ingredients && meal.ingredients.length > 0 && (
            <p className="text-muted-foreground text-sm">{meal.ingredients.length} ingredients</p>
          )}
          <RecipeActions mealId={meal.id_meal} />
        </div>
      </div>

      <div className="w-full h-px bg-border" />

      {/* Content: instructions + ingredients */}
      {(steps.length > 0 || (meal.ingredients?.length ?? 0) > 0) && (
        <div className="flex flex-col md:flex-row gap-10 items-start">

          {/* Instructions */}
          {steps.length > 0 && (
            <div className="flex-1 flex flex-col gap-6">
              <h2 className="text-2xl font-bold">Instructions</h2>
              <ol className="flex flex-col gap-4">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-4 p-4 rounded-xl bg-muted/50 border">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-1 pt-1">
                      {step.label && (
                        <span className="text-sm font-semibold">{step.label}</span>
                      )}
                      <p className="text-sm leading-relaxed">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Ingredients */}
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div className="w-full md:w-64 shrink-0 sticky top-24">
              <div className="rounded-2xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b">
                  <h2 className="text-lg font-bold">Ingredients</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{meal.ingredients.length} items</p>
                </div>
                <ul className="divide-y">
                  {meal.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center justify-between px-5 py-3 gap-4 text-sm">
                      <span className="font-medium">{ing.name}</span>
                      {ing.measure && (
                        <span className="text-muted-foreground text-xs text-right shrink-0">{ing.measure}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
