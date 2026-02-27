import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queries/query-client-config";
import { queryKeys } from "@/lib/queries/query-keys";
import { DecisionTableTabSkeleton } from "./decision-table-skeleton";
import { getDecisionTableServer } from "@/features/settings/api/approvals/decision-table/server";
import { DecisionTableTab } from "./decision-table-tab";

export function DecisionTableTabBoundary() {
  return (
    <Suspense fallback={<DecisionTableTabSkeleton />}>
      <DecisionTableTabHydration>
        <DecisionTableTab />
      </DecisionTableTabHydration>
    </Suspense>
  );
}

type DecisionTableTabHydrationProps = {
  children: React.ReactNode;
};

async function DecisionTableTabHydration({
  children,
}: Readonly<DecisionTableTabHydrationProps>) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.settings.approvals.decisionTable(),
    queryFn: getDecisionTableServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

export { DecisionTableTab } from "./decision-table-tab";
export { DecisionTableComponent } from "./decision-table";
export { DecisionTableRow } from "./decision-table-row";
export { DecisionTableHeader } from "./decision-table-header";
export { DecisionTableInfoBanner } from "./decision-table-info-banner";
export { DecisionTableLegend } from "./decision-table-legend";
export * from "./decision-table-helpers";
