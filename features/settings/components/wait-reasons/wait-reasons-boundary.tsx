import type { ReactNode } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/query-keys";
import { getQueryClient } from "@/lib/queries/query-client-config";
import { getWaitReasonsServer } from "../../api/wait-reasons/server";
import type { WaitReasonsRequest } from "../../api/wait-reasons/client";

type WaitReasonsBoundaryProps = {
  children: ReactNode;
  request?: WaitReasonsRequest;
};

export async function WaitReasonsBoundary({
  children,
  request,
}: Readonly<WaitReasonsBoundaryProps>) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.waitReasons.list(request),
    queryFn: () => getWaitReasonsServer(request),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
