"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { useWorkTypeRules } from "@/features/settings/hooks/use-work-type-rules";
import { WorkTypeRulesRequest } from "@/features/settings/types/approvals/work-type-rules";
import { WorkTypeRulesList } from "./work-type-rules-list";
import { ApplyDefaultAction } from "./apply-default-action";
import { Spinner } from "@/components/ui/spinner";

export function WorkTypeApprovalRules(params: Readonly<WorkTypeRulesRequest>) {
  const { data: workTypeRules, isPending } = useWorkTypeRules(params);
  const workTypeIds =
    workTypeRules?.data?.items
      .map((workTypeCategory) => {
        const workTypeIds = workTypeCategory.workTypes.map(
          (workType) => workType.workTypeId,
        );
        return workTypeIds;
      })
      .flat() || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Type Approval Rules</CardTitle>
        <CardDescription>
          Configure which work types require Decision Queue approval before
          external submission.
        </CardDescription>
        <CardAction>
          <ApplyDefaultAction workTypeIds={workTypeIds} />
        </CardAction>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center justify-center min-h-[40px]">
            <Spinner className="size-3" />
          </div>
        )}
        {!isPending && workTypeRules && (
          <WorkTypeRulesList paginatedWorkTypeRules={workTypeRules.data} />
        )}
      </CardContent>
    </Card>
  );
}
