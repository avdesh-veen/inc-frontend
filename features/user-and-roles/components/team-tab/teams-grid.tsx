"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { useTeamList } from "../../hooks/use-teams";
import type { Team, TeamRequest, TeamMemberRef } from "../../types/team-tab";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/queries/query-keys";
import { EditTeamModal } from "./edit-team-modal";

function getInitials(m: TeamMemberRef | { id: string; [key: string]: unknown }): string {
  if ("initials" in m && m.initials) return m.initials as string;
  if ("firstName" in m && "lastName" in m) {
    const f = (m.firstName as string || "").charAt(0);
    const l = (m.lastName as string || "").charAt(0);
    return (f + l).toUpperCase() || "?";
  }
  return "?";
}

function getDisplayName(m: TeamMemberRef): string {
  return [m.firstName, m.lastName].filter(Boolean).join(" ") || "—";
}

export function TeamsGrid(request?: TeamRequest) {
  const queryClient = useQueryClient();
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const { data, isFetching, isPending } = useTeamList({
    page: request?.page,
    limit: request?.limit,
    search: request?.search || undefined,
    sort: request?.sort,
    allData: request?.allData,
  });
  const teams = data?.data.items ?? [];
  const isLoading = isFetching || isPending;

  function handleEditSuccess() {
    queryClient.invalidateQueries({
      queryKey: [...queryKeys.usersRoles.all, "teams"],
    });
    queryClient.refetchQueries({
      queryKey: [...queryKeys.usersRoles.all, "teams"],
    });
  }

  return (
    <div className="relative min-h-80">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col justify-center items-center gap-2 rounded-lg">
          <Spinner className="h-8 w-8" />
          <p className="text-sm font-medium text-foreground">Updating results...</p>
        </div>
      )}

      <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", isLoading && "blur-[2px] pointer-events-none")}>
        {teams.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No teams found</p>
            </CardContent>
          </Card>
        ) : (
          teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={() => {
                setEditTeam(team);
                setEditOpen(true);
              }}
            />
          ))
        )}
      </div>

      <EditTeamModal
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditTeam(null);
        }}
        team={editTeam}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

function TeamCard({ team, onEdit }: { team: Team; onEdit: () => void }) {
  const leadInitials = team.teamLead ? getInitials(team.teamLead) : null;
  const leadName = team.teamLead ? getDisplayName(team.teamLead) : null;
  const users = team.users ?? team.members ?? [];
  const count = team.totalMembers ?? team.memberCount ?? users.length;
  const members = Array.isArray(users) ? users : [];
  const subtitle = team.focusArea ?? team.description ?? "—";

  return (
    <Card className="backdrop-blur-sm transition-colors p-5">
      <CardContent>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="size-12 shrink-0 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
              <svg className="size-6 text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-base text-foreground">{team.name}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-4 font-medium border",
                    team.isActive === false
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                  )}
                >
                  {team.isActive === false ? "Inactive" : "Active"}
                </Badge>
              </div>
              <div className="text-xs text-foreground/50">
                {subtitle}
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="p-1.5 rounded-md"
            aria-label="Edit team"
            onClick={onEdit}
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Button>
        </div>

        {leadName && (
          <div className="mb-4">
            <p className="text-[10px] font-medium text-foreground/40 uppercase mb-2">Team Lead</p>
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback className="rounded-full bg-primary text-primary-foreground text-xs">
                  {leadInitials}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-foreground">{leadName}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {count} {count === 1 ? "member" : "members"}
          </div>
          {members.length > 0 && (
            <div className="flex -space-x-2">
              {members.slice(0, 4).map((m, i) => (
                <Avatar key={"id" in m ? m.id : i} className="w-6 h-6 rounded-full">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-[9px] leading-0 font-bold text-white border border-[#1a2235]">
                    {getInitials(m as TeamMemberRef)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {count > 4 && (
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] leading-0 text-white border border-[#1a2235] z-1">
                  +{count - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
