"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkTypeRulesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <Skeleton className="h-5 w-52" />
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export function WorkTypeRulesTabSkeleton() {
  return (
    <div className="space-y-6">
      <WorkTypeRulesSkeleton />
      <WorkTypeRulesSkeleton />
      <WorkTypeRulesSkeleton />
    </div>
  );
}