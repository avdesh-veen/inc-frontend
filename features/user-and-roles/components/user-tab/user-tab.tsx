"use client";

import { UserRequest } from "../../types/user-tab";
import { StatsGrid } from "./stats-grid";
import { UsersGrid } from "./user-grid";
import { UserTabFilters } from "./users-filters";

export function UsersTab(request?: UserRequest) {
  return (
    <div className={"space-y-6"}>
      <StatsGrid />
      <UserTabFilters />
      <UsersGrid {...request} />
    </div>
  );
}
