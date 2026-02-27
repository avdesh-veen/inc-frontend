/**
 * Payers Page
 *
 * Main payer listing page with search, filters, and pagination.
 * Route: /records/payers
 *
 * Server component that wraps content with PayersBoundary for data prefetching.
 * All client components share the same TanStack Query cache key and read from
 * the hydrated state — no client-side network requests on initial render.
 */

import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PayerListHeader,
  PayerTabs,
  TabsContent,
  PayerCategoryChips,
  PayerSearchFilters,
  PayerTable,
  PayerPagination,
  PayerContactsTab,
  PayerKnowledgeBaseTab,
  PayerInsightsTab,
} from "@/features/records/payer";
import type { PayerTab } from "@/features/records/payer";
import { PayerCount } from "@/features/records/payer/components/payer-count";
import { PayersBoundary } from "@/features/records/payer/components/payers-boundary";
import type { PayerRequest } from "@/features/records/payer/types";

interface PayersPageProps {
  searchParams: Promise<{
    tab?: string;
    search?: string;
    category?: string;
    subcategory?: string;
    delegation?: string;
    panel?: string;
    sort?: string;
    order?: "asc" | "desc";
    page?: string;
    limit?: string;
  }>;
}

export default async function PayersPage({ searchParams }: PayersPageProps) {
  const params = await searchParams;

  const activeTab = (params.tab as PayerTab) || "list";

  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);

  // Filter values read from URL params
  const filters = {
    search: params.search || "",
    category: params.category || null,
    subcategory: params.subcategory || null,
    delegation: params.delegation || null,
    panel: params.panel || null,
  };

  // Single request object shared across boundary, table, pagination, and count
  // so all client components read from the same prefetched TanStack Query cache entry
  const payerRequest: PayerRequest = {
    page,
    limit,
    search: filters.search || undefined,
    type: filters.category || undefined,
    subCategory: filters.subcategory || undefined,
    isDelegated:
      filters.delegation === "yes" ? true
      : filters.delegation === "no" ? false
      : undefined,
    panelStatus:
      filters.panel === "Open" ? true
      : filters.panel === "Closed" ? false
      : undefined,
    sort: params.sort
      ? (params.order === "desc" ? `-${params.sort}` : params.sort)
      : undefined,
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PayerListHeader />

      <PayerTabs activeTab={activeTab}>
        <TabsContent value="list">
          <Suspense fallback={<PayersListSkeleton />}>
            <PayersBoundary request={payerRequest}>
              <Card className="overflow-hidden mt-4">
                <CardContent className="p-0">
                  <div className="p-5 border-b border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">All Payers</h3>
                      <PayerCount request={payerRequest} />
                    </div>
                    <PayerCategoryChips activeCategory={filters.category} />
                    <PayerSearchFilters filters={filters} />
                  </div>
                  <PayerTable request={payerRequest} />
                </CardContent>
              </Card>
              <PayerPagination request={payerRequest} />
            </PayersBoundary>
          </Suspense>
        </TabsContent>

        <TabsContent value="knowledge">
          <PayerKnowledgeBaseTab />
        </TabsContent>

        <TabsContent value="contacts">
          <PayerContactsTab />
        </TabsContent>

        <TabsContent value="insights">
          <PayerInsightsTab />
        </TabsContent>
      </PayerTabs>
    </div>
  );
}

function PayersListSkeleton() {
  return (
    <div className="space-y-4 mt-4">
      <Skeleton className="h-[420px] w-full rounded-[24px]" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-9 w-64" />
      </div>
    </div>
  );
}
