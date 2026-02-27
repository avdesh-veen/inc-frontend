"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  DiamondIcon,
  Alert02Icon,
  AiLockIcon,
} from "@hugeicons/core-free-icons";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type {
  WorkTypeRulesResponse,
  WorkTypeRules,
} from "@/features/settings/types/approvals/work-type-rules";
import type { PaginatedResponse } from "@/lib/api/types";
import { useMemo } from "react";
import { GridPagination } from "@/components/shared/grid-pagination";
import { useUpdateWorkTypeRulesStatus } from "@/features/settings/hooks/use-work-type-rules";

interface WorkTypeRulesListProps {
  paginatedWorkTypeRules: PaginatedResponse<WorkTypeRulesResponse>;
}

const CATEGORY_STYLES = [
  { icon: DiamondIcon, color: "text-violet-400", bgColor: "bg-violet-400/10" },
  { icon: Alert02Icon, color: "text-amber-400", bgColor: "bg-amber-400/10" },
  {
    icon: DiamondIcon,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  { icon: DiamondIcon, color: "text-blue-400", bgColor: "bg-blue-400/10" },
  { icon: DiamondIcon, color: "text-sky-400", bgColor: "bg-sky-400/10" },
  { icon: DiamondIcon, color: "text-green-400", bgColor: "bg-green-400/10" },
  { icon: DiamondIcon, color: "text-red-400", bgColor: "bg-red-400/10" },
  { icon: DiamondIcon, color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
  { icon: DiamondIcon, color: "text-slate-400", bgColor: "bg-slate-400/10" },
];

export function WorkTypeRulesList({
  paginatedWorkTypeRules,
}: Readonly<WorkTypeRulesListProps>) {
  const { items: categories, meta } = paginatedWorkTypeRules;

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No work type categories found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 mt-4">
        {categories.map((category) => (
          <WorkTypeCategoryCard key={category.categoryId} category={category} />
        ))}
      </div>

      <GridPagination
        totalItems={meta?.totalItems || 0}
        currentPage={meta?.currentPage || 1}
        itemsPerPage={meta?.itemsPerPage || 10}
        label="Work Type Categories"
        totalPages={meta?.totalPages || 0}
      />
    </div>
  );
}

interface WorkTypeCategoryCardProps {
  category: WorkTypeRulesResponse;
}

function WorkTypeCategoryCard({
  category,
}: Readonly<WorkTypeCategoryCardProps>) {
  const styleIndex = useMemo(() => {
    let hash = 0;
    const str = category.categoryId;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash) % CATEGORY_STYLES.length;
  }, [category.categoryId]);

  const {
    icon: CategoryIcon,
    color: iconColor,
    bgColor,
  } = CATEGORY_STYLES[styleIndex];

  return (
    <Card className="overflow-hidden rounded-xl p-0">
      <CardContent className="p-0 ">
        <CategoryHeader
          categoryName={category.categoryName}
          workTypesCount={category.workTypesInPage}
          requireApprovalCount={category.requireApprovalInPage}
          icon={CategoryIcon}
          iconColor={iconColor}
          bgColor={bgColor}
        />
        <WorkTypeItemsList workTypes={category.workTypes} />
      </CardContent>
    </Card>
  );
}

interface CategoryHeaderProps {
  categoryName: string;
  workTypesCount: number;
  requireApprovalCount: number;
  icon: typeof DiamondIcon;
  iconColor: string;
  bgColor: string;
}

function CategoryHeader({
  categoryName,
  workTypesCount,
  requireApprovalCount,
  icon: Icon,
  iconColor,
  bgColor,
}: Readonly<CategoryHeaderProps>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 border-b border-white/5",
        bgColor,
      )}
    >
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={Icon}
          className={cn("size-4", iconColor)}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="font-semibold text-foreground">{categoryName}</span>
        <span className="text-sm text-muted-foreground">
          ({workTypesCount} work types)
        </span>
      </div>
      <Badge
        variant="outline"
        className="bg-white/5 border-white/10 text-muted-foreground text-xs"
      >
        {requireApprovalCount}/{workTypesCount} require approval
      </Badge>
    </div>
  );
}

interface WorkTypeItemsListProps {
  workTypes: WorkTypeRules[];
}

function WorkTypeItemsList({ workTypes }: Readonly<WorkTypeItemsListProps>) {
  if (workTypes.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        No work types in this category.
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {workTypes.map((workType) => (
        <WorkTypeItem key={workType.id} workType={workType} />
      ))}
    </div>
  );
}

interface WorkTypeItemProps {
  workType: WorkTypeRules;
}

function WorkTypeItem({ workType }: Readonly<WorkTypeItemProps>) {
  const { mutate: updateWorkTypeRulesStatus, isPending } =
    useUpdateWorkTypeRulesStatus();

  const handleToggle = (checked: boolean) => {
    updateWorkTypeRulesStatus({
      id: workType.id,
      isActive: checked,
    });
  };

  const displayName = workType.workTypeName?.length > 0 ? workType.workTypeName : "--";

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground">
          {displayName}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {workType.workTypeShortName}
        </div>
        {workType.workTypeDescription && (
          <div className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">
            {workType.workTypeDescription}
          </div>
        )}
      </div>
      <div className="ml-4 shrink-0 flex items-center gap-2">
        {workType.isLocked ? (
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={AiLockIcon}
              className="size-3 text-amber-200/50"
            />
            <span className="text-xs text-destructive">Locked</span>
          </div>
        ) : null}
        {isPending ? <Spinner className="size-3" /> : null}
        <Switch
          disabled={workType.isLocked || isPending}
          checked={workType.isActive}
          onCheckedChange={handleToggle}
          aria-label={`Toggle approval requirement for ${displayName}`}
        />
      </div>
    </div>
  );
}
