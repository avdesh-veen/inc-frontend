"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHasPermission } from "@/features/auth/hooks/use-has-permission";
import { PERMISSIONS, RESOURCES } from "@/features/auth/utils/permission-constants";
import { EditUserSkillsModal } from "@/features/settings/components/skills/edit-user-skills-modal";
import { useSearchParamsManager } from "@/hooks/use-search-params";
import { cn } from "@/lib/utils";
import { useUsersWithSkills, useCategoriesWithSkills } from "../../hooks/use-skills";
import type { UserWithSkillsItem, UserWithSkillsRequest } from "../../types";

const SKILL_CATEGORY_COLORS: Record<string, string> = {
  Credentialing: "bg-violet-500/20 text-violet-300",
  Enrollment: "bg-emerald-500/20 text-emerald-300",
  Licensing: "bg-blue-500/20 text-blue-300",
  CAQH: "bg-teal-500/20 text-teal-300",
  "Quality Control": "bg-rose-500/20 text-rose-300",
  General: "bg-slate-500/20 text-slate-300",
  Leadership: "bg-purple-500/20 text-purple-300",
};

const DEFAULT_LIMIT = 10;

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function UserAssignmentsTab() {
  const { getParam, updateParams } = useSearchParamsManager();
  const { hasPermission: canManageSkills } = useHasPermission(
    RESOURCES.WORKFLOW_CONFIG,
    PERMISSIONS.WORKFLOW_MANAGE_SKILLS,
  );

  const searchQuery = getParam("ua_search") ?? "";
  const selectedSkillFilter = getParam("ua_skill") ?? "all";
  const pageParam = getParam("ua_page");
  const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const [inputValue, setInputValue] = React.useState(searchQuery);
  const [editingUser, setEditingUser] = React.useState<{ id: string; name: string } | null>(null);

  const request: UserWithSkillsRequest = React.useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
      ...(searchQuery && { search: searchQuery }),
      ...(selectedSkillFilter !== "all" && { skillId: selectedSkillFilter }),
    }),
    [page, searchQuery, selectedSkillFilter],
  );

  const { data, isLoading, isError } = useUsersWithSkills(request);
  const { data: categoriesData } = useCategoriesWithSkills();

  const users = React.useMemo(() => data?.data?.items ?? [], [data]);
  const meta = data?.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const allSkills = React.useMemo(
    () => (categoriesData?.data ?? []).flatMap((c) => c.skills),
    [categoriesData],
  );

  const skillCategoryMap = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of categoriesData?.data ?? []) {
      for (const skill of cat.skills) {
        map.set(skill.id, cat.name);
      }
    }
    return map;
  }, [categoriesData]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParams({ ua_page: String(newPage) }, { resetPage: false });
    }
  };

  const handleSkillFilterChange = (value: string) => {
    updateParams({ ua_skill: value === "all" ? null : value, ua_page: null });
  };

  const commitSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed === searchQuery) return;
    updateParams({ ua_search: trimmed || null, ua_page: null });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitSearch();
  };

  if (isLoading) {
    return <UserAssignmentsLoadingSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">Failed to load user assignments. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">User Skill Assignments</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="Search users…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-48 pr-8"
            />
            <button
              type="button"
              onClick={commitSearch}
              aria-label="Search"
              className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={Search01Icon} size={14} />
            </button>
          </div>
          <Select value={selectedSkillFilter} onValueChange={handleSkillFilterChange}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {allSkills.map((skill) => (
                <SelectItem key={skill.id} value={skill.id}>
                  {skill.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-[24px]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/6">
                  <TableHead className="text-xs font-bold">User</TableHead>
                  <TableHead className="text-xs font-bold">Role</TableHead>
                  <TableHead className="text-xs font-bold">Skills</TableHead>
                  <TableHead className="text-center text-xs font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      skillCategoryMap={skillCategoryMap}
                      canManage={canManageSkills}
                      onEdit={() => setEditingUser({ id: user.id, name: `${user.firstName} ${user.lastName}` })}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <p className="text-muted-foreground text-sm">
                        No users found matching your search criteria.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {users.length} of {meta?.totalItems ?? 0} users
        </span>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  aria-disabled={page <= 1}
                  className={cn(page <= 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  aria-disabled={page >= totalPages}
                  className={cn(page >= totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {selectedSkillFilter !== "all" && (
          <span>
            Filtered by: {allSkills.find((s) => s.id === selectedSkillFilter)?.name}
          </span>
        )}
      </div>

      {editingUser && (
        <EditUserSkillsModal
          userId={editingUser.id}
          userName={editingUser.name}
          open
          onOpenChange={(open) => { if (!open) setEditingUser(null); }}
        />
      )}
    </div>
  );
}

function getUserSkills(user: UserWithSkillsItem) {
  return user.userSkills?.length ? user.userSkills : user.skills ?? [];
}

interface UserRowProps {
  user: UserWithSkillsItem;
  skillCategoryMap: Map<string, string>;
  canManage: boolean;
  onEdit: () => void;
}

function UserRow({ user, skillCategoryMap, canManage, onEdit }: Readonly<UserRowProps>) {
  const skills = getUserSkills(user);

  return (
    <TableRow className="hover:bg-white/[0.02] transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-violet-500/20 text-violet-300 text-xs font-bold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-foreground font-medium">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {user.role?.roleName ?? "—"}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {skills.map((skill) => {
            const skillName = skill.skill?.name ?? skill.name;
            const skillId = skill.skill?.id ?? skill.id;
            const categoryName = skillCategoryMap.get(skillId) ?? "General";
            return (
              <Badge
                key={skill.id}
                className={cn(
                  "text-[10px] border-0",
                  SKILL_CATEGORY_COLORS[categoryName] ?? "bg-slate-500/20 text-slate-300",
                )}
              >
                {skillName}
              </Badge>
            );
          })}
          {skills.length === 0 && (
            <span className="text-xs text-muted-foreground">No skills assigned</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        {canManage ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={onEdit}
          >
            Edit
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground pointer-events-none opacity-40"
                  disabled
                  aria-disabled="true"
                >
                  Edit
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              You do not have permission to manage skill assignments.
            </TooltipContent>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
}

function UserAssignmentsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-44" />
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-white/5">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-1 flex-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
