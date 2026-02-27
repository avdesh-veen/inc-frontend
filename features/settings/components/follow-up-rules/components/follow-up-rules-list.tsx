"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteModal } from "@/components/ui/delete-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  useDeleteFollowUpRule,
  useToggleFollowUpRuleStatus,
} from "@/features/settings/hooks/use-follow-up-rules";
import type {
  FollowUpRule,
  FollowUpRulesListProps,
} from "@/features/settings/types";
import { TablePagination } from "@/components/shared/table-pagination";

const ESCALATE_TO_LABELS: Record<string, string> = {
  teamLead: "Team Lead",
  manager: "Manager",
  client: "Client",
  operationManager: "Operation Manager",
};

const CAT_CLASS: Record<string, string> = {
  Enrollment: "bg-emerald-500/20 text-emerald-500 border-emerald-500/20",
  All: "bg-slate-500/20 text-slate-400 border-slate-500/20",
  Licensing: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  Credentialing: "bg-violet-500/20 text-violet-400 border-violet-500/20",
  CAQH: "bg-teal-500/20 text-teal-400 border-teal-500/20",
  Maintenance: "bg-amber-500/20 text-amber-400 border-amber-500/20",
};
const CAT_FALLBACK = "bg-muted/50 text-muted-foreground border-border";

const thClass =
  "px-3 py-3 text-xs font-bold text-muted-foreground uppercase bg-transparent";

const AddSvg = () => (
  <svg
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);
const EditSvg = () => (
  <svg
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);
const DeleteSvg = () => (
  <svg
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export function FollowUpRulesList({ rules, meta, onPageChange }: Readonly<FollowUpRulesListProps>) {
  const [ruleToDelete, setRuleToDelete] = useState<FollowUpRule | null>(null);
  const [ruleToToggle, setRuleToToggle] = useState<FollowUpRule | null>(null);
  const deleteMutation = useDeleteFollowUpRule();
  const toggleMutation = useToggleFollowUpRuleStatus();
  const { toast } = useToast();

  const handleConfirmDelete = () => {
    if (!ruleToDelete) return;
    deleteMutation.mutate(ruleToDelete.id, {
      onSuccess: () => {
        setRuleToDelete(null);
        toast({ title: "Follow-up rule deleted" });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Failed to delete rule" });
      },
    });
  };

  const handleConfirmToggle = () => {
    if (!ruleToToggle) return;
    const newStatus = !ruleToToggle.active;
    toggleMutation.mutate(
      { id: ruleToToggle.id, isActive: newStatus },
      {
        onSuccess: () => {
          setRuleToToggle(null);
          const label = newStatus ? "enabled" : "disabled";
          toast({ title: `Follow-up rule ${label} successfully` });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to update rule status",
          });
        },
      },
    );
  };

  return (
    <>
      <Card className="p-6">
        <CardContent>
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-base font-bold text-foreground">
              Follow-Up Rules
            </h3>
            <Button variant="tertiary" size="md" asChild>
              <Link href="/settings/workflow/follow-up-rules/create">
                <AddSvg /> Add Rule
              </Link>
            </Button>
          </div>
          <Table variant="secondary">
            <TableHeader className="bg-transparent border-b border-white/10">
              <TableRow className="border-b border-border hover:bg-transparent">
                {[
                  "Rule Name",
                  "Category",
                  "Trigger Event",
                  "Escalate To",
                  "Status",
                  "",
                ].map((h) => (
                  <TableHead key={h} className={cn(thClass, h === "" && "")}>
                    {h || <span className="sr-only">Actions</span>}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No follow-up rules found.
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => (
                  <TableRow
                    key={rule.id}
                    className="border-white/5 hover:bg-white/2"
                  >
                   <TableCell className="max-w-60 whitespace-normal break-words">{rule.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.category.length === 0 ? (
                          <Badge
                            variant="outline"
                            className={cn("rounded-lg", CAT_FALLBACK)}
                          >
                            All
                          </Badge>
                        ) : (
                          rule.category.slice(0, 1).map((cat) => (
                            <Badge
                              key={cat.code ?? cat.name}
                              variant="outline"
                              className={cn(
                                "rounded-lg text-xs",
                                CAT_CLASS[cat.name] ?? CAT_FALLBACK,
                              )}
                            >
                              {cat.name}
                              {rule.category.length > 1 &&
                                ` + ${rule.category.length - 1} more`}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-white/70">
                      {rule.triggerEvent}
                    </TableCell>
                    <TableCell>{rule.escalateTo ? (ESCALATE_TO_LABELS[rule.escalateTo] ?? rule.escalateTo) : "—"}</TableCell>
                    <TableCell>
                      <Switch
                        className="cursor-pointer"
                        checked={rule.active}
                        onCheckedChange={() => setRuleToToggle(rule)}
                        disabled={toggleMutation.isPending}
                        aria-label={`Toggle status for rule "${rule.name}"`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Edit rule"
                          asChild
                        >
                          <Link
                            href={`/settings/workflow/follow-up-rules/${rule.id}/edit`}
                          >
                            <EditSvg />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost-destructive"
                          size="icon-xs"
                          aria-label="Delete rule"
                          onClick={() => setRuleToDelete(rule)}
                          disabled={deleteMutation.isPending}
                        >
                          <DeleteSvg />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            meta={meta}
            label="follow-up rules"
            onPageChange={onPageChange}
          />
        </CardContent>
      </Card>
      <DeleteModal
        open={!!ruleToDelete}
        onOpenChange={(open) => !open && setRuleToDelete(null)}
        title="Delete follow-up rule?"
        name={ruleToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      <ConfirmModal
        open={!!ruleToToggle}
        onOpenChange={(open) => !open && setRuleToToggle(null)}
        title={
          ruleToToggle?.active
            ? "Disable follow-up rule?"
            : "Enable follow-up rule?"
        }
        description={
          ruleToToggle?.active
            ? `Are you sure you want to disable "${ruleToToggle.name}"? This rule will no longer be applied to new cases.`
            : `Are you sure you want to enable "${ruleToToggle?.name}"? This rule will start being applied to new cases.`
        }
        onConfirm={handleConfirmToggle}
        isPending={toggleMutation.isPending}
        confirmLabel={ruleToToggle?.active ? "Disable" : "Enable"}
        cancelLabel="Cancel"
      />
    </>
  );
}
