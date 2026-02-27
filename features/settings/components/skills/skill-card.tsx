/**
 * Skill Card Component
 *
 * Card displaying skill information including name, description,
 * proficiency level, and certification requirement.
 */

"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon, Certificate01Icon } from "@hugeicons/core-free-icons";
import { PROFICIENCY_LEVEL_LABEL } from "../../types/skills";
import type { SkillApiItem, ProficiencyLevel } from "../../types";

export interface SkillCardProps {
  /** Skill data */
  skill: SkillApiItem;
  /** Handler for edit action */
  onEdit: () => void;
}

const PROFICIENCY_COLORS: Record<ProficiencyLevel, string> = {
  trainee: "bg-amber-500/20 text-amber-300",
  competent: "bg-blue-500/20 text-blue-300",
  expert: "bg-emerald-500/20 text-emerald-300",
};

export function SkillCard({ skill, onEdit }: Readonly<SkillCardProps>) {
  return (
    <Card className="relative p-4 hover:shadow-md transition-shadow duration-200 group">
      {/* Edit Button (top-right) */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 size-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onEdit}
        aria-label={`Edit ${skill.name}`}
      >
        <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" />
      </Button>

      {/* Content */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm pr-8 line-clamp-1" title={skill.name}>
          {skill.name}
        </h4>

        <p className="text-xs text-muted-foreground line-clamp-2" title={skill.description}>
          {skill.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className={cn("text-xs font-semibold", PROFICIENCY_COLORS[skill.minimumProficiency])}
          >
            Min: {PROFICIENCY_LEVEL_LABEL[skill.minimumProficiency]}
          </Badge>

          {skill.requiresCertification && (
            <Badge variant="outline" className="text-xs gap-1">
              <HugeiconsIcon icon={Certificate01Icon} className="size-3" />
              Cert Req
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
