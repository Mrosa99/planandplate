import { useState, useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll<T>(
  fetchFn: (limit: number, offset: number) => Promise<T[]>,
  pageSize = 20,
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const fetchFnRef = useRef(fetchFn);
  const loadingRef = useRef(false);

  // Keep fetchFnRef current without triggering re-fetches
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      loadingRef.current = true;
      setLoading(true);
      try {
        const newItems = await fetchFnRef.current(pageSize, (page - 1) * pageSize);
        if (!cancelled) {
          if (newItems.length < pageSize) setHasMore(false);
          setItems((prev) => [...prev, ...newItems]);
        }
      } finally {
        if (!cancelled) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [page, pageSize, resetKey]);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setResetKey((k) => k + 1);
  }, []);

  const removeItem = useCallback((predicate: (item: T) => boolean) => {
    setItems((prev) => prev.filter((item) => !predicate(item)));
  }, []);

  return { items, loading, hasMore, observerRef, reset, removeItem };
}
