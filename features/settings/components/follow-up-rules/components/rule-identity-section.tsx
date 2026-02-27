"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAllWorkCategories } from "@/features/settings/hooks/use-work-categories";
import type { WorkCategory } from "@/features/settings/types/work-category";
import { cn } from "@/lib/utils";
import { SectionCard } from "./section-card";

/** Sentinel value for "All" work categories toggle */
export const ALL_WORK_CATEGORIES_ID = "__all__";

export interface RuleIdentitySectionProps {
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  /** Selected work category IDs (from API) */
  selectedCategoryIds: string[];
  /** Called with category id, or ALL_WORK_CATEGORIES_ID and allIds when "All" is toggled */
  onToggleCategory: (id: string, allIds?: string[]) => void;
  active: boolean;
  onActiveChange: (value: boolean) => void;
}

export function RuleIdentitySection({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  selectedCategoryIds,
  onToggleCategory,
  active,
  onActiveChange,
}: Readonly<RuleIdentitySectionProps>) {
  const { data: workCategoriesResponse, isLoading: isLoadingCategories } =
    useAllWorkCategories();
  const raw = workCategoriesResponse?.data;
  const workCategories: WorkCategory[] = Array.isArray(raw)
    ? raw
    : raw &&
        typeof raw === "object" &&
        "items" in raw &&
        Array.isArray((raw as { items: unknown }).items)
      ? (raw as { items: WorkCategory[] }).items
      : [];
  const allIds = workCategories.map((c) => c.id);
  const isAllSelected =
    allIds.length > 0 && selectedCategoryIds.length === allIds.length;

  return (
    <SectionCard title="Rule Identity" iconKey="tag">
      <div className="space-y-3">
        <div>
          <Label>Rule Name *</Label>
          <Input
            size="sm"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., Payer Initial Follow-up"
            minLength={3}
            maxLength={100}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            size="sm"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={2}
            placeholder="What this rule automates..."
            maxLength={250}
            className={cn("", "resize-none")}
          />
        </div>
        <div>
          <Label>Work Categories</Label>
          {isLoadingCategories ? (
            <Skeleton className="h-9 w-full rounded-lg" />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {workCategories.length > 0 && (
                <div
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer",
                    isAllSelected
                      ? " bg-violet-500/30 text-violet-300 border-violet-500/50"
                      : " bg-white/5 text-white/50 hover:bg-white/10 border-transparent",
                  )}
                  onClick={() =>
                    onToggleCategory(ALL_WORK_CATEGORIES_ID, allIds)
                  }
                >
                  All
                </div>
              )}
              {workCategories.map((cat) => (
                <div
                  key={cat.id}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer",
                    selectedCategoryIds.includes(cat.id)
                      ? "bg-violet-500/30 text-violet-300 border-violet-500/50"
                      : "bg-white/5 text-white/50 hover:bg-white/10 border-transparent",
                  )}
                  onClick={() => onToggleCategory(cat.id)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-2">
          <Label className="text-xs text-white/50 mb-0">Rule Active</Label>
          <Switch checked={active} onCheckedChange={onActiveChange} />
        </div>
      </div>
    </SectionCard>
  );
}
