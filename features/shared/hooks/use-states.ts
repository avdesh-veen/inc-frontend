/**
 * Global States Hooks
 * 
 * React Query hooks for fetching and managing states data.
 * Used across the application for states dropdowns.
 */

import { useQuery } from "@tanstack/react-query";
import { getStatesDropdownClient } from "../api/states/client";

const STATES_QUERY_KEY = "states-dropdown";

/**
 * Hook to fetch states dropdown data
 * 
 * @returns Query result with paginated states data
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useStatesDropdown();
 * const states = data?.data?.items || [];
 * 
 * <Select>
 *   {states.map((state) => (
 *     <SelectItem key={state.id} value={state.id}>
 *       {state.name}
 *     </SelectItem>
 *   ))}
 * </Select>
 * ```
 */
export function useStatesDropdown() {
  return useQuery({
    queryKey: [STATES_QUERY_KEY],
    queryFn: getStatesDropdownClient,
    staleTime: 5 * 60 * 1000,
  });
}
