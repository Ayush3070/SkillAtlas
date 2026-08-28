import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * useAsync — minimal async fetch hook with cancel-safe behaviour.
 * Calls the loader on mount and whenever the key changes.
 */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef<{ cancelled: boolean }>({ cancelled: false });
  const tickRef = useRef(0);

  const run = useCallback(() => {
    const myTick = ++tickRef.current;
    cancelRef.current.cancelled = false;
    setLoading(true);
    setError(null);
    loader()
      .then((d) => {
        if (cancelRef.current.cancelled || tickRef.current !== myTick) return;
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelRef.current.cancelled || tickRef.current !== myTick) return;
        setError(e?.message ?? "Failed to load");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
    return () => { cancelRef.current.cancelled = true; };
  }, [run]);

  return { data, loading, error, refetch: run };
}
