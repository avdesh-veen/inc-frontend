import { Suspense } from "react";
import { WaitReasonsContent } from "@/features/settings/components/wait-reasons/wait-reasons-content";
import { WaitReasonsBoundary } from "@/features/settings/components/wait-reasons/wait-reasons-boundary";
import type { WaitReasonsRequest } from "@/features/settings/api/wait-reasons/client";
import WaitReasonsLoading from "./loading";

type WaitReasonsSearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  isActive?: string;
  category?: string;
  pauseSla?: string;
};

type PageProps = {
  searchParams: Promise<WaitReasonsSearchParams>;
};

function parsePositiveNumber(value: string | undefined, defaultValue: number): number {
  if (value == null || value === "") return defaultValue;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value == null || value === "") return undefined;
  return value === "true";
}

function buildRequest(params: WaitReasonsSearchParams): WaitReasonsRequest {
  const request: WaitReasonsRequest = {
    page: parsePositiveNumber(params.page, 1),
    limit: parsePositiveNumber(params.limit, 10),
  };
  
  if (params.search != null && params.search !== "")
    request.search = params.search;
  
  const isActive = parseBoolean(params.isActive);
  if (isActive !== undefined) request.isActive = isActive;
  
  if (params.category === "internal" || params.category === "external")
    request.category = params.category;
  
  const pauseSla = parseBoolean(params.pauseSla);
  if (pauseSla !== undefined) request.pauseSla = pauseSla;
  
  return request;
}

export default async function WaitReasonsPage(props: Readonly<PageProps>) {
  const searchParams = await props.searchParams;
  const request = buildRequest(searchParams);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="min-h-screen flex-1 rounded-xl md:min-h-min">
        <h1 className="text-2xl font-semibold">Wait Reasons</h1>
        <p className="text-muted-foreground mt-2">
          View and manage wait reasons.
        </p>
        <div className="mt-6">
          <Suspense fallback={<WaitReasonsLoading />}>
            <WaitReasonsBoundary request={request}>
              <WaitReasonsContent request={request} />
            </WaitReasonsBoundary>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
