export interface WorkTypeRules {
  id: string;
  workTypeId: string;
  workTypeName: string;
  workTypeShortName: string;
  workTypeDescription: string;
  complexityLevel: ComplexityLevel;
  expectedDuration: number;
  isLocked: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type ComplexityLevel = "low" | "medium" | "high";

export interface WorkTypeRulesRequest {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isLocked?: boolean;
  workTypeIsActive?: boolean;
  workTypeIsLocked?: boolean;
  allData?: boolean;
}

export interface WorkTypeRulesResponse {
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  categoryDescription: string;
  categoryIsActive: boolean;
  workTypesInPage: number;
  requireApprovalInPage: number;
  workTypes: WorkTypeRules[];
}

export interface ApplyDefaultWorkTypeRulesRequest {
  workTypeIds: string[];
}

export interface ApplyDefaultWorkTypeRulesResponse {  
  created: number;
  updated: number;
  skipped: number;
  total: number;
}

export interface UpdateWorkTypeRulesStatusRequest {
  id: string;
  isActive: boolean;
}

export interface UpdateWorkTypeRulesStatusResponse {
  isLocked: boolean;
  isActive: boolean;
}