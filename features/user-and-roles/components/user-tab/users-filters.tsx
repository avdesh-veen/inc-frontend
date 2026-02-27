"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DebouncedSearchInput } from "@/components/shared/debounced-search-input";
import { RoleAutoComplete } from "../role-tab/role-auto-complete";
import { Role } from "../../types/role-tab";
import { useSearchParamsManager } from "@/hooks/use-search-params";

export function UserTabFilters() {
  const { getParam, updateParams } = useSearchParamsManager();

  const roleType = getParam("roleType");
  const role = getParam("role");
  const search = getParam("search");

  const handleRoleTypeChange = (value: string) => {
    updateParams({ roleType: value === "all" ? null : value });
  };

  const handleRoleChange = (value: Role | null) => {
    updateParams({ role: value?.id ?? null });
  };

  const handleSearchChange = (value: string) => {
    updateParams({ search: value || null });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Role Type Filter */}
      <Select value={roleType || "all"} onValueChange={handleRoleTypeChange}>
        <SelectTrigger variant="primary" className="w-28">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="internal">Internal</SelectItem>
          <SelectItem value="external">External</SelectItem>
        </SelectContent>
      </Select>

      <RoleAutoComplete variant="primary" value={role} onValueChange={handleRoleChange} />

      <DebouncedSearchInput
        value={search}
        onValueChange={handleSearchChange}
        placeholder="Search users..."
        delay={500}
      />
    </div>
  );
}
