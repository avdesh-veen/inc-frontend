/**
 * Skills UI Constants
 *
 * Static definitions for proficiency levels used by the skills legend.
 * Category data and skills list come from the API.
 */

import type { SkillProficiencyLevel } from "@/features/settings/types/skills";

/**
 * Proficiency level definitions for the overview legend.
 */
export const SKILL_PROFICIENCY_LEVELS: SkillProficiencyLevel[] = [
  {
    id: "prof-1",
    level: 1,
    key: "trainee",
    name: "Trainee",
    description: "Learning, requires supervision",
    color: "amber",
  },
  {
    id: "prof-2",
    level: 2,
    key: "competent",
    name: "Competent",
    description: "Can work independently",
    color: "blue",
  },
  {
    id: "prof-3",
    level: 3,
    key: "expert",
    name: "Expert",
    description: "Can train others, handles complex cases",
    color: "emerald",
  },
];
