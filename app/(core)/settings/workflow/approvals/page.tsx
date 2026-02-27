import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appRoutes } from "@/lib/constants/navigation";

import { DecisionQueueTabBoundary } from "@/features/settings/components/approvals/decision-queue-tab";
import { WorkTypeRulesTabBoundary } from "@/features/settings/components/approvals/work-type-rules";
import { ApprovalWorkflowsTabBoundary } from "@/features/settings/components/approvals/approval-workflows-tab";
import { DecisionTableTabBoundary } from "@/features/settings/components/approvals/decision-table-tab";
import { ApprovalWorkflowsRequest } from "@/features/settings/types/approvals/approval-workflows";
import { AddWorkflowModal } from "@/features/settings/components/approvals/approval-workflows-tab/add-workflow-modal";
import { WorkTypeRulesRequest } from "@/features/settings/types/approvals/work-type-rules";

const tabs = [
  { value: "decision-queue", label: "Decision Queue" },
  { value: "work-type-rules", label: "Work Type Rules" },
  { value: "approvals", label: "Approval Workflows" },
  { value: "decision-table", label: "Decision Table (DMN)" },
] as const;

type ApprovalsSearchParams = {
  tab?: string;
  page?: string;
  limit?: string;
  search?: string;
  isActive?: string;
  isLocked?: string;
  workTypeIsActive?: string;
  workTypeIsLocked?: string;
  triggerEventId?: string;
  allData?: string;
};

type PageProps = {
  searchParams: Promise<ApprovalsSearchParams>;
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

function buildWorkTypeRulesRequest(params: ApprovalsSearchParams): WorkTypeRulesRequest {
  const request: WorkTypeRulesRequest = {
    page: parsePositiveNumber(params.page, 1),
    limit: parsePositiveNumber(params.limit, 10),
  };
  
  if (params.search != null && params.search !== "") request.search = params.search;
  
  const isActive = parseBoolean(params.isActive);
  if (isActive !== undefined) request.isActive = isActive;
  
  const isLocked = parseBoolean(params.isLocked);
  if (isLocked !== undefined) request.isLocked = isLocked;
  
  const workTypeIsActive = parseBoolean(params.workTypeIsActive);
  if (workTypeIsActive !== undefined) request.workTypeIsActive = workTypeIsActive;
  
  const workTypeIsLocked = parseBoolean(params.workTypeIsLocked);
  if (workTypeIsLocked !== undefined) request.workTypeIsLocked = workTypeIsLocked;
  
  const allData = parseBoolean(params.allData);
  if (allData !== undefined) request.allData = allData;
  
  return request;
}

function buildApprovalWorkflowsRequest(params: ApprovalsSearchParams): ApprovalWorkflowsRequest {
  const request: ApprovalWorkflowsRequest = {
    page: parsePositiveNumber(params.page, 1),
    limit: parsePositiveNumber(params.limit, 10),
  };
  
  if (params.search != null && params.search !== "") request.search = params.search;
  
  const isActive = parseBoolean(params.isActive);
  if (isActive !== undefined) request.isActive = isActive;
  
  if (params.triggerEventId != null && params.triggerEventId !== "") 
    request.triggerEventId = params.triggerEventId;
  
  return request;
}

export default async function ApprovalsPage(props: Readonly<PageProps>) {
  const searchParams = await props.searchParams;
  const currentTab = searchParams.tab ?? "decision-queue";
  
  const workTypeRulesRequest = buildWorkTypeRulesRequest(searchParams);
  const approvalWorkflowsRequest = buildApprovalWorkflowsRequest(searchParams);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Tabs defaultValue={currentTab} className="space-y-6 cursor-pointer">
        <TabsList variant="glass">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link href={appRoutes.settings.workflow.approvals(tab.value)}>
                {tab.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
        {/* Decision Queue Content */}
        <TabsContent value="decision-queue">
          <DecisionQueueTabBoundary />
        </TabsContent>

        {/* Work Type Rules Content */}
        <TabsContent value="work-type-rules" asChild>
          <WorkTypeRulesTabBoundary {...workTypeRulesRequest} />
        </TabsContent>

        {/* Approvals Content */}
        <TabsContent value="approvals">
          <ApprovalWorkflowsTabBoundary {...approvalWorkflowsRequest} />
          <AddWorkflowModal />
        </TabsContent>

        {/* Decision Table Content */}
        <TabsContent value="decision-table">
          <DecisionTableTabBoundary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
