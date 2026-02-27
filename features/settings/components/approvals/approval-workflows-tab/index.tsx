import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queries/query-client-config";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApprovalWorkflowsTabSkeleton } from "./approval-workflows-skeleton";
import { getApprovalWorkflowsServer } from "@/features/settings/api/approvals/workflows/server";
import { ApprovalWorkflowsTab } from "./approval-workflows-tab";
import { ApprovalWorkflowsRequest } from "@/features/settings/types/approvals/approval-workflows";

export function ApprovalWorkflowsTabBoundary(request: Readonly<ApprovalWorkflowsRequest>) {
  return (
    <Suspense fallback={<ApprovalWorkflowsTabSkeleton />}>
      <ApprovalWorkflowsTabHydration {...request}>
        <ApprovalWorkflowsTab {...request} />
      </ApprovalWorkflowsTabHydration>
    </Suspense>
  );
}

type ApprovalWorkflowsTabHydrationProps = {
  children: React.ReactNode;
} & ApprovalWorkflowsRequest;

async function ApprovalWorkflowsTabHydration({
  children,
  ...request
}: ApprovalWorkflowsTabHydrationProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.settings.approvals.workflows(request),
    queryFn: () => getApprovalWorkflowsServer(request),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
