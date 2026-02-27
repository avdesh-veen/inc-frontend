import { PaginatedResponse, ApiResponse } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ExternalRole } from "../types/external-role-tab";
import { getExternalRoleList } from "../api/external-role-tab/client";
import { RoleRequest } from "../types/role-tab";

export function useExternalRoles(request?: RoleRequest) {
    return useQuery<ApiResponse<PaginatedResponse<ExternalRole>>, Error>({
        queryKey: queryKeys.usersRoles.externalRoles(),
        queryFn: () => getExternalRoleList(request),
    });
}