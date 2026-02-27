import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { DecisionQueueConfig } from "./decision-queue-config";
import { SLAByType } from "./sla-by-type";
import { RoutingConfig } from "./routing-config";
import { DecisionQueueTabSkeleton } from "./decision-queue-skeleton";

import { getQueryClient } from "@/lib/queries/query-client-config";
import { queryKeys } from "@/lib/queries/query-keys";
import { getDecisionQueueServer, getDefaultRoutingServer } from "@/features/settings/api/approvals/decision-queue/server";

function DecisionQueueTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4 w-full">
      <DecisionQueueConfig />
      <SLAByType />
      <div className="col-span-full">
        <RoutingConfig />
      </div>
    </div>
  );
}

export function DecisionQueueTabBoundary() {
  return (
    <Suspense fallback={<DecisionQueueTabSkeleton />}>
      <DecisionQueueTabHydration>
        <DecisionQueueTab />
      </DecisionQueueTabHydration>
    </Suspense>
  );
}

type DecisionQueueTabHydrationProps = {
  children: React.ReactNode;
};
async function DecisionQueueTabHydration({
  children,
}: DecisionQueueTabHydrationProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.settings.approvals.decisionQueue(),
    queryFn: getDecisionQueueServer,
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.settings.approvals.defaultRouting(),
    queryFn: getDefaultRoutingServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
