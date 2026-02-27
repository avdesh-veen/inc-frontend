/**
 * SLA Targets Section Component
 *
 * Table with inline editing for SLA targets.
 * Follows the TeamsGrid pattern: local state for edit modal,
 * HeaderRow and Row extracted as typed sub-components.
 */

"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { TablePagination } from "@/components/shared/table-pagination";
import {
  useUpdateSLATarget,
  useDeleteSLATarget,
} from "@/features/settings/hooks/use-sla-rules";
import type { SLATarget } from "@/features/settings/types/sla-rules";
import type { PaginationMeta } from "@/lib/api/types";
import { SLATargetsSkeleton } from "./sla-rules-skeletons";
import { AddSLATargetModal } from "./add-sla-target-modal";

interface SLATargetsSectionProps {
  targets: SLATarget[];
  isLoading?: boolean;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
}

export function SLATargetsSection({
  targets,
  isLoading = false,
  meta,
  onPageChange,
}: Readonly<SLATargetsSectionProps>) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<SLATarget | null>(null);

  const handleAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleEdit = (target: SLATarget) => {
    setEditTarget(target);
    setModalOpen(true);
  };

  const handleModalChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditTarget(null);
  };

  if (!targets.length && isLoading) {
    return <SLATargetsSkeleton />;
  }

  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-(--glass-blur) border border-glass-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-foreground">SLA Targets</h3>
        <Button
          variant="ghost"
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 text-sm hover:bg-violet-500/30"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Target
        </Button>
      </div>

      {/* Table with loading overlay */}
      <div className="relative min-h-80 rounded-md border border-border-10 overflow-auto">
        {isLoading && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-sm z-10 flex flex-col justify-center items-center gap-2">
            <Spinner className="h-8 w-8" />
            <p className="text-sm font-medium text-foreground">
              Updating results...
            </p>
          </div>
        )}

        <div className={isLoading ? "blur-[2px] pointer-events-none" : ""}>
          <Table variant="secondary">
            <TableHeader>
              <SLATargetHeaderRow />
            </TableHeader>
            <TableBody>
              {targets.length === 0 ? (
                <TableRow className="cursor-default">
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center hover:bg-transparent"
                  >
                    No SLA targets found
                  </TableCell>
                </TableRow>
              ) : (
                targets.map((target) => (
                  <SLATargetRow
                    key={target.id}
                    target={target}
                    onEdit={handleEdit}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <TablePagination meta={meta} label="targets" onPageChange={onPageChange} />

      {/* Add / Edit Modal */}
      <AddSLATargetModal
        open={modalOpen}
        onOpenChange={handleModalChange}
        target={editTarget}
      />
    </div>
  );
}

function SLATargetHeaderRow() {
  return (
    <TableRow className="border-b border-border-10 hover:bg-transparent cursor-default">
      <TableHead className="text-xs font-bold text-text-50 uppercase">
        Request Type
      </TableHead>
      <TableHead className="text-xs font-bold text-text-50 uppercase">
        Target Days
      </TableHead>
      <TableHead className="text-xs font-bold text-text-50 uppercase">
        Warning at
      </TableHead>
      <TableHead className="text-xs font-bold text-text-50 uppercase">
        Critical at
      </TableHead>
      <TableHead className="text-xs font-bold text-text-50 uppercase">
        Status
      </TableHead>
      <TableHead className="text-xs font-bold text-text-50 uppercase">
        Actions
      </TableHead>
    </TableRow>
  );
}

interface SLATargetRowProps {
  target: SLATarget;
  onEdit: (target: SLATarget) => void;
}

function SLATargetRow({ target, onEdit }: Readonly<SLATargetRowProps>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const updateTarget = useUpdateSLATarget();
  const deleteTarget = useDeleteSLATarget();

  const handleStatusToggle = (checked: boolean) => {
    updateTarget.mutate({ id: target.id, data: { isActive: checked } });
  };

  const handleConfirmDelete = () => {
    deleteTarget.mutate(target.id, {
      onSuccess: () => setDeleteDialogOpen(false),
    });
  };

  return (
    <>
      <TableRow className="border-b border-border-5 cursor-default">
        {/* Request Type */}
        <TableCell className="px-4 py-4">
          <div>
            <span className="font-medium text-foreground">
              {target.workType?.name}
            </span>
          </div>
        </TableCell>

        {/* Target Days */}
        <TableCell className="px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="w-20 px-3 py-1.5 rounded-lg bg-glass-bg border border-border-10 text-foreground text-center">
              {target.targetDays}
            </span>
            <span className="text-text-50">days</span>
          </div>
        </TableCell>

        {/* Warning Days */}
        <TableCell className="px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="w-20 px-3 py-1.5 rounded-lg bg-glass-bg border border-border-10 text-amber-400 text-center">
              {target.warningDays}
            </span>
            <span className="text-text-50">days</span>
          </div>
        </TableCell>

        {/* Critical Days */}
        <TableCell className="px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="w-20 px-3 py-1.5 rounded-lg bg-glass-bg border border-border-10 text-rose-400 text-center">
              {target.criticalDays}
            </span>
            <span className="text-text-50">days</span>
          </div>
        </TableCell>

        {/* Status Toggle */}
        <TableCell className="px-4 py-4">
          <Switch
            checked={target.isActive}
            onCheckedChange={handleStatusToggle}
            disabled={updateTarget.isPending}
          />
        </TableCell>

        {/* Actions */}
        <TableCell className="px-4 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(target)}
              className="text-text-50 hover:text-violet-400 transition-colors"
              aria-label="Edit SLA target"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
            </button>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="text-text-50 hover:text-rose-400 transition-colors"
              aria-label="Delete SLA target"
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </button>
          </div>
        </TableCell>
      </TableRow>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete SLA Target"
        description={
          <DeleteTargetDescription workType={target.workType?.name} />
        }
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        onConfirm={handleConfirmDelete}
        isLoading={deleteTarget.isPending}
      />
    </>
  );
}

function DeleteTargetDescription({
  workType,
}: Readonly<{ workType?: string }>) {
  return (
    <>
      Are you sure you want to delete the SLA target for{" "}
      <span className="font-semibold">{workType}</span>? This action cannot be
      undone.
    </>
  );
}

