"use client";

import * as React from "react";
import type { WaitReason } from "../../types";
import { Button } from "@/components/ui/button";
import { useHasPermission } from "@/features/auth/hooks/use-has-permission";
import {
  AddWaitReasonModal,
  type WaitReasonFormData,
} from "./add-wait-reason-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TablePagination } from "@/components/shared/table-pagination";
import type { PaginationMeta } from "@/lib/api/types";

interface WaitReasonsListViewProps {
  waitReasons: WaitReason[];
  isLoading?: boolean;
  onAddReason: (reason: WaitReason) => void;
  onUpdateReason: (id: string, updates: Partial<WaitReason>) => void;
  onDeleteReason: (id: string) => void;
  meta?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
}

/**
 * Table skeleton for loading state
 */
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="px-4 py-4">
            <Skeleton className="h-6 w-28 rounded" />
          </TableCell>
          <TableCell className="px-4 py-4">
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell className="px-4 py-4">
            <Skeleton className="h-6 w-16 rounded-lg" />
          </TableCell>
          <TableCell className="px-4 py-4">
            <Skeleton className="h-4 w-12" />
          </TableCell>
          <TableCell className="px-4 py-4">
            <Skeleton className="h-4 w-10" />
          </TableCell>
          <TableCell className="px-4 py-4">
            <Skeleton className="h-4 w-10" />
          </TableCell>
          <TableCell className="px-4 py-4">
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function WaitReasonsListView({
  waitReasons,
  isLoading = false,
  onAddReason,
  onUpdateReason,
  onDeleteReason,
  meta,
  onPageChange,
}: Readonly<WaitReasonsListViewProps>) {
  const { hasPermission: canManage } = useHasPermission(
    "Workflow Config",
    "workflow_config.manage_wait_reasons",
  );
  const [showModal, setShowModal] = React.useState(false);
  const [editingReasonId, setEditingReasonId] = React.useState<string | null>(
    null,
  );

  const handleAddReason = () => {
    setEditingReasonId(null);
    setShowModal(true);
  };

  const handleEditReason = (reasonId: string) => {
    setEditingReasonId(reasonId);
    setShowModal(true);
  };

  const handleSave = (data: WaitReasonFormData) => {
    if (editingReasonId) {
      onUpdateReason(editingReasonId, {
        code: data.code,
        label: data.name,
        category: data.category === "external" ? "External" : "Internal",
        pausesSLA: data.pauseSla,
        warningDays: data.warningDays,
        criticalDays: data.criticalDays,
        autoChaseDays: data.autoChaseDays,
        description: data.description,
        status: data.isActive ? "Active" : "Inactive",
      });
    } else {
      onAddReason({
        id: "",
        code: data.code,
        label: data.name,
        category: data.category === "external" ? "External" : "Internal",
        pausesSLA: data.pauseSla,
        warningDays: data.warningDays,
        criticalDays: data.criticalDays,
        autoChaseDays: data.autoChaseDays,
        description: data.description,
        status: data.isActive ? "Active" : "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    setShowModal(false);
    setEditingReasonId(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingReasonId(null);
  };

  const existingReason = editingReasonId
    ? waitReasons.find((r) => r.id === editingReasonId)
    : null;
  const initialData = existingReason
    ? ({
        code: existingReason.code,
        name: existingReason.label,
        description: existingReason.description || "",
        isActive: existingReason.status === "Active",
        warningDays: existingReason.warningDays,
        pauseSla: existingReason.pausesSLA,
        criticalDays: existingReason.criticalDays,
        category:
          existingReason.category === "External" ? "external" : "internal",
        autoChaseDays: existingReason.autoChaseDays ?? 0,
      } as const)
    : undefined;

  return (
    <>
      <AddWaitReasonModal
        open={showModal}
        onOpenChange={handleModalClose}
        onSave={handleSave}
        initialData={initialData}
        isEdit={!!editingReasonId}
      />

      <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-foreground">
            Wait State Definitions
          </h3>
          {canManage && (
            <Button
              onClick={handleAddReason}
              size="sm"
              className="bg-violet-500/20 text-violet-300 hover:bg-violet-500/30"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Wait Reason
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border-10">
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-text-50 uppercase">
                  Reason ID
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-text-50 uppercase">
                  Display Label
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-text-50 uppercase">
                  Category
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-text-50 uppercase">
                  Pauses SLA
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-text-50 uppercase">
                  Warning
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-text-50 uppercase">
                  Critical
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-text-50 uppercase"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : (
                waitReasons.map((reason) => {
                  const catColor =
                    reason.category === "External" ? "amber" : "blue";
                  const catLabel =
                    reason.category === "External" ? "External" : "Internal";

                  return (
                    <TableRow
                      key={reason.id}
                      className="border-b border-border-5 hover:bg-glass-bg transition-colors"
                    >
                      <TableCell className="p-2 align-top whitespace-nowrap px-4 py-4">
                        <code className="text-xs text-violet-400 bg-violet-500/10 px-2 py-1 rounded">
                          {reason.code}
                        </code>
                      </TableCell>
                      <TableCell className="p-2 align-top whitespace-nowrap px-4 py-4 font-medium text-foreground">
                        {reason.label}
                      </TableCell>
                      <TableCell className="p-2 align-top whitespace-nowrap px-4 py-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs bg-${catColor}-500/20 text-${catColor}-300`}
                        >
                          {catLabel}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        {reason.pausesSLA ? (
                          <span
                            className="flex items-center gap-1"
                            style={{ color: "#34d399" }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>{" "}
                            Yes
                          </span>
                        ) : (
                          <span className="text-text-50">No</span>
                        )}
                      </TableCell>
                      <TableCell className="p-2 align-top whitespace-nowrap px-4 py-4">
                        <span className="text-amber-400">
                          {reason.warningDays}d
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-top whitespace-nowrap px-4 py-4">
                        <span className="text-rose-400">
                          {reason.criticalDays}d
                        </span>
                      </TableCell>
                      {canManage && (
                        <TableCell className="p-2 align-top whitespace-nowrap px-4 py-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant={"ghost"}
                              onClick={() => handleEditReason(reason.id)}
                              className="p-2 hover:bg-glass-bg text-text-50 hover:text-foreground transition-colors"
                              title="Edit wait reason"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="p-2 hover:bg-glass-bg text-text-50 hover:text-rose-400 transition-colors"
                                  title="Delete wait reason"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to delete &quot;
                                    {reason.label}&quot;?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDeleteReason(reason.id)}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {!isLoading && waitReasons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-50 mb-4">
                No wait reasons configured yet.
              </p>
              {canManage && (
                <Button
                  onClick={handleAddReason}
                  variant="outline"
                  className="bg-violet-500/20 text-violet-300 hover:bg-violet-500/30"
                >
                  Create Your First Wait Reason
                </Button>
              )}
            </div>
          )}

          <TablePagination
            meta={meta}
            label="wait reasons"
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
}
