import type { ReactNode } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/query-keys";
import { getQueryClient } from "@/lib/queries/query-client-config";
import {
  getFollowUpRulesServer,
  getFollowUpRulesStatisticsServer,
} from "../../api/follow-up-rules/server";
import type { FollowUpRulesRequest } from "@/features/settings/types";

type FollowUpRulesBoundaryProps = {
  children: ReactNode;
  request?: FollowUpRulesRequest;
};

export async function FollowUpRulesBoundary({
  children,
  request,
}: Readonly<FollowUpRulesBoundaryProps>) {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.settings.followUpRules.list(request),
      queryFn: () => getFollowUpRulesServer(request),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.settings.followUpRules.statistics(),
      queryFn: getFollowUpRulesStatisticsServer,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
