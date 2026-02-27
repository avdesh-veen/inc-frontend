import { Suspense } from "react";
import { TriggerEventsBoundary } from "@/features/settings/components/trigger-events/components/trigger-events-boundary";
import { TriggerEventsContent } from "@/features/settings/components/trigger-events/components/trigger-events-content";
import { TriggerEventsHeaderClient } from "@/features/settings/components/trigger-events/trigger-events-header-client";
import { TriggerEventRequest, TriggerEventType, TriggerEventCategory } from "@/features/settings/types/trigger-events";
import TriggerEventsLoading from "./loading";

type Props = {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    category?: string;
    isActive?: string;
    search?: string;
  };
};

export default async function TriggerEventsPage(props: Readonly<Props>) {
  const { page, limit, type, category, isActive, search } = props.searchParams;
  
  const request: TriggerEventRequest = {
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 100,
  };
  
  if (type) request.type = type as TriggerEventType;
  if (category) request.category = category as TriggerEventCategory;
  if (isActive !== undefined) request.isActive = isActive === 'true';
  if (search) request.search = search;

  return (
    <>
      <TriggerEventsHeaderClient
        title="Trigger Events Configuration"
        description="Define events that can trigger follow-up rules and automated workflows"
      />
      
      <div className="mt-4">
        <Suspense fallback={<TriggerEventsLoading />}>
          <TriggerEventsBoundary request={request}>
            <TriggerEventsContent {...request} />
          </TriggerEventsBoundary>
        </Suspense>
      </div>
    </>
  );
}
