import type { ReactNode } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/query-keys";
import { getQueryClient } from "@/lib/queries/query-client-config";

import { TriggerEventRequest } from "../../../types/trigger-events";
import { getTriggerEventsListServer, getTriggerEventsStatsServer } from "../../../api/trigger-events/server";

type TriggerEventsBoundaryProps = {
  children: ReactNode;
  request?: TriggerEventRequest;
};

export async function TriggerEventsBoundary({ children, request }: Readonly<TriggerEventsBoundaryProps>) {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.triggerEvents.list(request as Record<string, unknown>),
      queryFn: () => getTriggerEventsListServer(request),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.triggerEvents.stats(),
      queryFn: () => getTriggerEventsStatsServer(),
    }),
  ]);
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
