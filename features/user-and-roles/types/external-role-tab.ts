export enum InternalRoleCategory {
    LEADERSHIP = "Leadership",
    OPERATIONS = "Operations",
    QUALITY = "Quality",
}

export enum Scope {
    ALL_CLIENTS = "all-clients",
    ASSIGNED = "assigned",
}

export type ExternalCapability =
    | "all-facilities"
    | "assigned-only"
    | "can-add-providers"
    | "can-export";

export interface InternalRole {
    id: string;
    name: string;
    roleCode: string;
    category: InternalRoleCategory;
    description: string;
    fullAccessCount: number;
    limitedCount: number;
    scope: Scope;
    isCustomizable: boolean;
}

export interface ExternalRole {
    id: string;
    name: string;
    category: ExternalRoleCategory;
    description: string;
    typicalUsers: string[];
    capabilities: ExternalCapability[];
    roleName : string;
    categoryName : string;
}

export enum ExternalRoleCategory {
    CLIENT_LEADERSHIP = "Client Leadership",
    CLIENT_OPERATIONS = "Client Operations",
    CLIENT_FINANCE = "Client Finance",
    PROVIDER = "Provider",
}