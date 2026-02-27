import { Suspense } from "react";
import { FollowUpRulesBoundary } from "@/features/settings/components/follow-up-rules/follow-up-rules-boundary";
import { FollowUpRulesContent } from "@/features/settings/components/follow-up-rules/follow-up-rules-content";
import type {
  FollowUpRulesRequest,
  FollowUpRulesSearchParams,
} from "@/features/settings/types";
import FollowUpRulesLoading from "./loading";

type PageProps = {
  searchParams: Promise<FollowUpRulesSearchParams>;
};

function buildRequest(params: FollowUpRulesSearchParams): FollowUpRulesRequest {
  const request: FollowUpRulesRequest = {};
  if (params.search != null && params.search !== "")
    request.search = params.search;
  if (params.sort != null && params.sort !== "") request.sort = params.sort;
  if (params.limit != null && params.limit !== "") {
    const limit = Number(params.limit);
    if (Number.isFinite(limit)) request.limit = limit;
  }
  if (params.page != null && params.page !== "") {
    const page = Number(params.page);
    if (Number.isFinite(page)) request.page = page;
  }
  if (params.allData === "true") request.allData = true;
  if (params.taskType != null && params.taskType !== "")
    request.taskType = params.taskType;
  return request;
}

export default async function FollowUpRulesPage(props: Readonly<PageProps>) {
  const searchParams = await props.searchParams;
  const request = buildRequest(searchParams);

  return (
    <Suspense fallback={<FollowUpRulesLoading />}>
      <FollowUpRulesBoundary request={request}>
        <FollowUpRulesContent request={request} />
      </FollowUpRulesBoundary>
    </Suspense>
  );
}
