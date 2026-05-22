import { useState, useEffect, useCallback } from "react";
import { useInfiniteScroll } from "./use-infinite-scroll";
import { searchMealsCached } from "@/app/actions/search";
import { MealData } from "@/lib/supabase/types";

export function useSearch(query: string, debounceMs = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const fetchFn = useCallback(
    (limit: number, offset: number): Promise<MealData[]> =>
      searchMealsCached(debouncedQuery, limit, offset),
    [debouncedQuery],
  );

  const { items, loading, hasMore, observerRef, reset } = useInfiniteScroll(fetchFn);

  useEffect(() => {
    reset();
  }, [debouncedQuery, reset]);

  return { items, loading, hasMore, observerRef };
}
