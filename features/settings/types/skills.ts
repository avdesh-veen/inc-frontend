/**
 * Skills Types
 *
 * Type definitions matching the backend API response for skills.
 */

/**
 * Proficiency levels as returned by the API
 */
export type ProficiencyLevel = "trainee" | "competent" | "expert";

/**
 * Numeric proficiency level (1-3) for display
 */
export const PROFICIENCY_LEVEL_NUMBER: Record<ProficiencyLevel, number> = {
  trainee: 1,
  competent: 2,
  expert: 3,
};

/**
 * Proficiency display labels
 */
export const PROFICIENCY_LEVEL_LABEL: Record<ProficiencyLevel, string> = {
  trainee: "Trainee",
  competent: "Competent",
  expert: "Expert",
};

/**
 * Skill category as returned by the API
 */
export interface SkillCategory {
  id: string;
  name: string;
  code: string;
  icon: string;
  description: string;
  isActive: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Relation object returned by the detail endpoint for each linked work type
 */
export interface SkillWorkTypeRelation {
  id: string;
  skillId: string;
  workTypeId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Skill as returned by the API
 */
export interface SkillApiItem {
  id: string;
  name: string;
  code: string;
  description: string;
  category: SkillCategory | null;
  requiresCertification: boolean;
  certificationValidity: number | null;
  minimumProficiency: ProficiencyLevel;
  isActive: boolean;
  skillWorkTypes: SkillWorkTypeRelation[];
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

/**
 * Skills list request parameters
 */
export interface SkillsRequest {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Payload for creating a new skill (POST /skills)
 */
export interface CreateSkillPayload {
  name: string;
  categoryId: string;
  description: string;
  requiresCertification: boolean;
  certificationValidity: number | null;
  minimumProficiency: ProficiencyLevel;
  isActive: boolean;
  skillWorkTypes: string[];
}

/**
 * Payload for updating an existing skill (PATCH /skills/:id)
 */
export type UpdateSkillPayload = CreateSkillPayload;

/**
 * Skill item within a category-with-skills response
 */
export interface CategorySkillItem {
  id: string;
  name: string;
  description: string;
  requiresCertification: boolean;
  certificationValidity: number | null;
  minimumProficiency: ProficiencyLevel;
  isActive: boolean;
  createdAtUTC: number;
  updatedAtUTC: number;
}

/**
 * Category with its nested skills (from /skills/categories-with-skills)
 */
export interface CategoryWithSkills {
  id: string;
  name: string;
  code: string;
  icon: string | null;
  description: string;
  isActive: boolean;
  color: string | null;
  createdAtUTC: number;
  updatedAtUTC: number;
  skills: CategorySkillItem[];
}

/**
 * Static proficiency level definition for the UI legend
 */
export interface SkillProficiencyLevel {
  id: string;
  level: number;
  key: ProficiencyLevel;
  name: string;
  description: string;
  color: "amber" | "blue" | "emerald";
}

/**
 * Work type (for skill form linking)
 */
export interface WorkType {
  id: string;
  name: string;
  category: string;
}

/**
 * Request params for /users/with-skills
 */
export interface UserWithSkillsRequest {
  page?: number;
  limit?: number;
  search?: string;
  skillId?: string;
}

/**
 * Skill item nested within a user-with-skills response
 */
export interface UserSkillItem {
  id: string;
  name: string;
  skill?: {
    id: string;
    name: string;
  };
}

/**
 * User item as returned by /users/with-skills
 */
export interface UserWithSkillsItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: string;
    roleName: string;
    roleCode: string;
    isInternal: boolean;
  };
  status: string;
  isActive: boolean;
  skills: UserSkillItem[];
  userSkills: UserSkillItem[];
}
