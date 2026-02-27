import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateFollowUpRulePage } from "@/features/settings/components/follow-up-rules/create-follow-up-content";

export const dynamic = "force-dynamic";

interface EditFollowUpRulePageProps {
  params: Promise<{ id: string }>;
}

async function EditFollowUpRuleContent({
  params,
}: Readonly<EditFollowUpRulePageProps>) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 px-1">
      <CreateFollowUpRulePage ruleId={id} />
    </div>
  );
}

export default function EditFollowUpRulePage(
  props: Readonly<EditFollowUpRulePageProps>,
) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col gap-4 py-4 px-1">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
            </div>
          </div>
        </div>
      }
    >
      <EditFollowUpRuleContent params={props.params} />
    </Suspense>
  );
}
