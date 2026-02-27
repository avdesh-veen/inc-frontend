"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkillCategorySection } from "./skill-category-section";
import { SKILL_PROFICIENCY_LEVELS } from "@/lib/constants/skills-data";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import type { CategoryWithSkills, CategorySkillItem, SkillProficiencyLevel } from "../../types";

interface SkillDefinitionsTabProps {
  categories: CategoryWithSkills[];
  onCreateSkill: () => void;
  onEditSkill: (skill: CategorySkillItem) => void;
  onDeleteSkill: (id: string) => void;
}

const PROFICIENCY_LEVEL_COLORS: Record<string, string> = {
  amber: "bg-amber-500/20 text-amber-300",
  blue: "bg-blue-500/20 text-blue-300",
  emerald: "bg-emerald-500/20 text-emerald-300",
};

export function SkillDefinitionsTab({
  categories,
  onCreateSkill,
  onEditSkill,
  onDeleteSkill,
}: Readonly<SkillDefinitionsTabProps>) {
  const metrics = React.useMemo(() => {
    const allSkills = categories.flatMap((c) => c.skills);
    return {
      totalSkills: allSkills.length,
      requireCertification: allSkills.filter((s) => s.requiresCertification).length,
      activeSkills: allSkills.filter((s) => s.isActive).length,
    };
  }, [categories]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-foreground">
            Skill Definitions ({metrics.totalSkills} skills)
          </h3>
          <Button onClick={onCreateSkill} variant="secondary">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Add Skill
          </Button>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <SkillCategorySection
              key={category.id}
              category={category}
              skills={category.skills}
              onEditSkill={onEditSkill}
              onDeleteSkill={onDeleteSkill}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Card className="gap-0">
          <h4 className="text-sm font-bold text-white/70 mb-3">Overview</h4>
          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <div className="text-white/50">Total Skills</div>
              <span className="font-bold text-foreground">
                {metrics.totalSkills}
              </span>
            </div>
            <div className="flex justify-between">
              <div className="text-white/50">Require Certification</div>
              <span className="font-bold text-foreground">
                {metrics.requireCertification}
              </span>
            </div>
            <div className="flex justify-between">
              <div className="text-white/50">Active</div>
              <span className="font-bold text-emerald-400">
                {metrics.activeSkills}
              </span>
            </div>
          </div>
        </Card>

        <Card className="gap-0">
          <h4 className="text-sm font-bold text-white/70 mb-3">
            Proficiency Levels
          </h4>
          <div className="space-y-2">
            {SKILL_PROFICIENCY_LEVELS.map((level: SkillProficiencyLevel) => (
              <div
                key={level.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/2"
              >
                <div
                  className={`size-8 rounded-md flex items-center justify-center font-bold text-sm shrink-0 ${PROFICIENCY_LEVEL_COLORS[level.color] ?? ""}`}
                >
                  {level.level}
                </div>
                <div>
                  <div className="text-sm text-white font-medium">
                    {level.name}
                  </div>
                  <div className="text-[10px] text-white/40">
                    {level.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
