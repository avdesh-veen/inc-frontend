/**
 * Work Types Boundary Component (Server)
 *
 * Server component that prefetches data for work types, categories, and statistics.
 * Uses HydrationBoundary to pass prefetched data to client components.
 */

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queries/query-client-config";
import { queryKeys } from "@/lib/queries/query-keys";
import { getWorkCategoriesServer } from "../../api/work-categories/server";
import {
  getWorkTypesServer,
  getWorkTypeStatisticsServer,
} from "../../api/work-types/server";

interface WorkTypesBoundaryProps {
  children: React.ReactNode;
  searchParams?: {
    categoryId?: string;
    sort?: string;
    page?: string;
    limit?: string;
  };
}

export async function WorkTypesBoundary({
  children,
  searchParams,
}: Readonly<WorkTypesBoundaryProps>) {
  const queryClient = getQueryClient();

  const categoryId = searchParams?.categoryId;
  const sort = searchParams?.sort || "name";
  const parsedPage = Number.parseInt(searchParams?.page ?? "", 10);
  const page = Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;
  const parsedLimit = Number.parseInt(searchParams?.limit ?? "", 10);
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit >= 1
      ? Math.min(parsedLimit, 100)
      : 50;

  const workTypesRequest: Record<string, unknown> = {
    sort,
    page,
    limit,
  };
  
  if (categoryId) {
    workTypesRequest.categoryId = categoryId;
  }

  const workCategoriesRequest = {
    limit: 100,
    page: 1,
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.workCategories.list(workCategoriesRequest as Record<string, unknown>),
      queryFn: () => getWorkCategoriesServer(workCategoriesRequest),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.workTypes.list(workTypesRequest),
      queryFn: () => getWorkTypesServer(workTypesRequest),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.workTypes.statistics(),
      queryFn: () => getWorkTypeStatisticsServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
