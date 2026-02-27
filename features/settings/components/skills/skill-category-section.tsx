"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PROFICIENCY_LEVEL_LABEL } from "../../types/skills";
import type { CategoryWithSkills, CategorySkillItem, ProficiencyLevel } from "../../types";

interface SkillCategorySectionProps {
  category: CategoryWithSkills;
  skills: CategorySkillItem[];
  onEditSkill: (skill: CategorySkillItem) => void;
  onDeleteSkill: (id: string) => void;
}

const CATEGORY_DOT_COLORS: Record<string, string> = {
  violet: "bg-violet-400",
  emerald: "bg-emerald-400",
  blue: "bg-blue-400",
  teal: "bg-teal-400",
  rose: "bg-rose-400",
  slate: "bg-slate-400",
  purple: "bg-purple-400",
};

const PROFICIENCY_BADGE_COLORS: Record<ProficiencyLevel, string> = {
  trainee: "bg-amber-500/20 text-amber-300",
  competent: "bg-blue-500/20 text-blue-300",
  expert: "bg-emerald-500/20 text-emerald-300",
};

export function SkillCategorySection({
  category,
  skills,
  onEditSkill,
  onDeleteSkill,
}: Readonly<SkillCategorySectionProps>) {
  const [pendingDelete, setPendingDelete] = React.useState<CategorySkillItem | null>(null);

  if (skills.length === 0) return null;

  return (
    <>
    <Card>
      <CardContent className="p-1">
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-3 h-3 rounded-full ${(category.color && CATEGORY_DOT_COLORS[category.color]) ?? "bg-slate-400"}`} />
          <span className="font-bold text-foreground">{category.name}</span>
          <span className="text-xs text-white/40">({skills.length})</span>
        </div>

        <div className="flex flex-col gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="group flex w-full items-center justify-between p-3 rounded-md bg-white/2 hover:bg-white/4 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-foreground">
                    {skill.name}
                  </div>
                  {skill.requiresCertification && skill.certificationValidity && (
                    <Badge size="xs">
                      Cert {skill.certificationValidity}mo
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {skill.description}
                </p>
              </div>

              <div className="flex items-center gap-1 ml-3 shrink-0">
                <Badge
                  size="sm"
                  className={`text-xs ${skill.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-400"}`}
                >
                  {skill.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge
                  size="sm"
                  className={`text-xs ${PROFICIENCY_BADGE_COLORS[skill.minimumProficiency] ?? ""}`}
                >
                  Min:{" "}
                  {PROFICIENCY_LEVEL_LABEL[skill.minimumProficiency] ?? skill.minimumProficiency}
                </Badge>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                  onClick={() => onEditSkill(skill)}
                  aria-label={`Edit ${skill.name}`}
                >
                  <HugeiconsIcon icon={PencilEdit02Icon} className="size-3.5" aria-hidden="true" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-400"
                  onClick={() => setPendingDelete(skill)}
                  aria-label={`Delete ${skill.name}`}
                >
                  <HugeiconsIcon icon={Delete02Icon} className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <AlertDialog open={!!pendingDelete} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Skill</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold text-foreground">{pendingDelete?.name}</span>?
            This action cannot be undone and will remove all user assignments for this skill.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setPendingDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-500 hover:bg-rose-600 text-white"
            onClick={() => {
              if (pendingDelete) {
                onDeleteSkill(pendingDelete.id);
                setPendingDelete(null);
              }
            }}
          >
            Delete Skill
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
