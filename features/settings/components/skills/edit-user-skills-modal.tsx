"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useUserSkills, useUpdateUserSkills } from "../../../user-and-roles/hooks/use-users";

interface EditUserSkillsModalProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserSkillsModal({
  userId,
  userName,
  open,
  onOpenChange,
}: Readonly<EditUserSkillsModalProps>) {
  const { data: skillsResponse, isLoading } = useUserSkills(open ? userId : undefined);
  const updateSkills = useUpdateUserSkills();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [initialized, setInitialized] = useState(false);

  const skills = useMemo(() => skillsResponse?.data ?? [], [skillsResponse?.data]);

  if (skills.length > 0 && !initialized) {
    setSelectedIds(new Set(skills.filter((s) => s.isAssigned).map((s) => s.id)));
    setInitialized(true);
  }

  const getSkillName = useCallback((s: (typeof skills)[number]) => s.skillName, []);

  const filtered = useMemo(
    () =>
      search
        ? skills.filter((s) => getSkillName(s).toLowerCase().includes(search.toLowerCase()))
        : skills,
    [skills, search, getSkillName],
  );

  const assignedCount = selectedIds.size;
  const hasChanges = useMemo(() => {
    const original = new Set(skills.filter((s) => s.isAssigned).map((s) => s.id));
    if (original.size !== selectedIds.size) return true;
    for (const id of selectedIds) {
      if (!original.has(id)) return true;
    }
    return false;
  }, [skills, selectedIds]);

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    updateSkills.mutate(
      { userId, skillIds: Array.from(selectedIds) },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Skills &mdash; {userName}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {assignedCount} skill{assignedCount !== 1 ? "s" : ""} assigned
          </p>
        </DialogHeader>

        <Input
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />

        <div className="flex-1 overflow-y-auto min-h-0 space-y-1 pr-1">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {search ? "No skills match your search" : "No skills available"}
            </p>
          ) : (
            filtered.map((skill) => {
              const checked = selectedIds.has(skill.id);
              return (
                <div
                  key={skill.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer"
                  onClick={() => toggle(skill.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(skill.id);
                    }
                  }}
                  role="checkbox"
                  aria-checked={checked}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(skill.id)}
                      className="size-3.5 rounded-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Label className="text-foreground m-0 cursor-pointer">{getSkillName(skill)}</Label>
                  </div>
                  {skill.isAssigned && checked && (
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                      Assigned
                    </Badge>
                  )}
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="pt-3 border-t border-white/5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateSkills.isPending}
          >
            {updateSkills.isPending ? "Saving..." : "Save Skills"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
