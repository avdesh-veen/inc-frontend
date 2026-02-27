import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo, useOptimistic, useTransition } from "react";

type ParamsObject = Record<string, string>;

/**
 * Hook to manage URL search parameters with optimistic updates
 *
 * Uses React 19's useOptimistic hook to provide instant UI feedback
 * while URL params update in the background
 *
 * @returns Object with optimistic params, getters, and update function
 */
export function useSearchParamsManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentParams = useMemo(() => {
    const paramsObj: ParamsObject = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    return paramsObj;
  }, [searchParams]);

  // Optimistic state for instant UI updates
  const [optimisticParams, setOptimisticParams] = useOptimistic(
    currentParams,
    (state: ParamsObject, updates: Record<string, string | null>) => {
      const newState = { ...state };

      // Apply optimistic updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          delete newState[key];
        } else {
          newState[key] = value;
        }
      });

      // Reset page when filters change
      if (!updates.page) {
        delete newState.page;
      }

      return newState;
    },
  );

  // Update search params with optimistic UI
  const updateParams = useCallback(
    (
      updates: Record<string, string | null>,
      options?: { resetPage?: boolean },
    ) => {
      startTransition(async () => {
        // Apply optimistic update immediately for instant UI feedback
        setOptimisticParams(updates);

        // Build new URL params
        const newParams = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === "") {
            newParams.delete(key);
          } else {
            newParams.set(key, value);
          }
        });

        // Reset page to 1 when filters change (unless explicitly disabled or updating page itself)
        const shouldResetPage = options?.resetPage !== false && !updates.page;
        if (shouldResetPage) {
          newParams.delete("page");
        }

        const queryString = newParams.toString();
        const url = queryString ? `${pathname}?${queryString}` : pathname;

        // Update URL in background
        router.replace(url, { scroll: false });
      });
    },
    [searchParams, pathname, router, setOptimisticParams],
  );

  // Get a specific param value from optimistic state
  const getParam = useCallback(
    (key: string): string | null => {
      return optimisticParams[key] ?? null;
    },
    [optimisticParams],
  );

  return {
    params: optimisticParams,
    getParam,
    updateParams,
    isPending,
  };
}
