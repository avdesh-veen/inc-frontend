import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queries/query-client-config";
import { queryKeys } from "@/lib/queries/query-keys";
import { WorkTypeRulesTabSkeleton } from "./work-type-rules-skeleton";
import { getWorkTypeRulesServer } from "@/features/settings/api/approvals/work-type-rules/server";
import { WorkTypeRulesRequest } from "@/features/settings/types/approvals/work-type-rules";
import { WorkTypeApprovalRules } from "./work-type-rules";

export function WorkTypeRulesTabBoundary(
  params: Readonly<WorkTypeRulesRequest>,
) {
  return (
    <Suspense fallback={<WorkTypeRulesTabSkeleton />}>
      <WorkTypeRulesTabHydration params={params}>
        <WorkTypeApprovalRules {...params} />
      </WorkTypeRulesTabHydration>
    </Suspense>
  );
}

type WorkTypeRulesTabHydrationProps = {
  children: React.ReactNode;
  params: WorkTypeRulesRequest;
};
async function WorkTypeRulesTabHydration({
  children,
  params,
}: Readonly<WorkTypeRulesTabHydrationProps>) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.settings.approvals.workTypeRules(params),
    queryFn: () => getWorkTypeRulesServer(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
