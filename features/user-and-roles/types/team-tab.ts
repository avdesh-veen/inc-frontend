export interface TeamMemberRef {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  initials?: string;
  email?: string;
}

/** Matches API response: id, name, focusArea, isActive, users, totalMembers, createdAt, updatedAt, createdBy, updatedBy */
export interface Team {
  id: string;
  name: string;
  focusArea?: string;
  description?: string;
  teamLead?: TeamMemberRef;
  memberCount?: number;
  totalMembers?: number;
  members?: TeamMemberRef[];
  users?: TeamMemberRef[] | { id: string; [key: string]: unknown }[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface TeamRequest {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  allData?: boolean;
}

export interface TeamStats {
  total: number;
  totalMembers: number;
  avgTeamSize: number;
  active: number;
}

export interface CreateTeamPayload {
  name: string;
  teamLeadId?: string;
  focusArea?: string;
  isActive: boolean;
}

/** Full payload for create. Use Partial<UpdateTeamPayload> for PATCH to send only changed fields. */
export type UpdateTeamPayload = CreateTeamPayload;

export interface TeamLeadManager {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  roleName: string;
}
