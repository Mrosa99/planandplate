import { useState, useEffect, useCallback } from "react";
import { useInfiniteScroll } from "./use-infinite-scroll";
import { searchMeals } from "@/lib/supabase/search";
import { MealData } from "@/lib/supabase/types";

export function useSearch(query: string, debounceMs = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const fetchFn = useCallback(
    (limit: number, offset: number): Promise<MealData[]> =>
      searchMeals(debouncedQuery, limit, offset),
    [debouncedQuery],
  );

  const { items, loading, hasMore, observerRef, reset } = useInfiniteScroll(fetchFn);

  useEffect(() => {
    reset();
  }, [debouncedQuery, reset]);

  return { items, loading, hasMore, observerRef };
}
