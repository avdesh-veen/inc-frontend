"use client";

import { TeamRequest } from "../../types/team-tab";
import { TeamStatsGrid } from "./stats-grid";
import { TeamsGrid } from "./teams-grid";

export function TeamsTab(request?: TeamRequest) {
  return (
    <div className="space-y-6">
      <TeamStatsGrid />
      <TeamsGrid {...request} />
    </div>
  );
}
