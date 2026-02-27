/**
 * SLA Override Section Component
 *
 * Table with pagination for SLA overrides.
 * Follows the SLATargetsSection pattern: local state for edit modal,
 * HeaderRow and Row extracted as typed sub-components.
 */

'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon, Delete02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { TablePagination } from '@/components/shared/table-pagination';
import { useDeleteSLAOverride } from '@/features/settings/hooks/use-sla-rules';
import type { SLAOverride } from '@/features/settings/types/sla-rules';
import type { PaginationMeta } from '@/lib/api/types';
import { SLAOverrideSkeleton } from './sla-rules-skeletons';
import { AddSLAOverrideModal } from './add-sla-override-modal';

interface SLAOverrideSectionProps {
  overrides: SLAOverride[];
  isLoading?: boolean;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
}

export function SLAOverrideSection({
  overrides,
  isLoading = false,
  meta,
  onPageChange,
}: Readonly<SLAOverrideSectionProps>) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingOverride, setEditingOverride] = React.useState<SLAOverride | null>(null);

  const handleAdd = () => {
    setEditingOverride(null);
    setModalOpen(true);
  };

  const handleEdit = (override: SLAOverride) => {
    setEditingOverride(override);
    setModalOpen(true);
  };

  const handleModalChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditingOverride(null);
  };

  if (!overrides.length && isLoading) {
    return <SLAOverrideSkeleton />;
  }

  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-(--glass-blur) border border-glass-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">SLA Override Configuration</h3>
          <p className="text-xs text-text-50 mt-1">
            Configure client and payer-specific SLA targets (most specific wins)
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 text-sm hover:bg-violet-500/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Override
        </Button>
      </div>

      {/* Priority Hierarchy Banner */}
      <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-2">
          <HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-blue-300">Override Priority (highest to lowest)</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 text-center">
            <span className="font-bold">1.</span> Client + Payer
          </div>
          <div className="p-2 rounded-lg bg-blue-500/15 text-blue-300/80 text-center">
            <span className="font-bold">2.</span> Payer Default
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-300/60 text-center">
            <span className="font-bold">3.</span> Client Default
          </div>
          <div className="p-2 rounded-lg bg-glass-bg text-text-50 text-center">
            <span className="font-bold">4.</span> System Default
          </div>
        </div>
      </div>

      {/* Table with loading overlay */}
      <div className="relative min-h-60 rounded-md border border-border-10 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-sm z-10 flex flex-col justify-center items-center gap-2">
            <Spinner className="h-8 w-8" />
            <p className="text-sm font-medium text-foreground">Updating results...</p>
          </div>
        )}

        <div className={isLoading ? "blur-[2px] pointer-events-none" : ""}>
          <Table
            className="table-fixed w-full"
            variant="secondary"
          >
            <TableHeader>
              <SLAOverrideHeaderRow />
            </TableHeader>
            <TableBody>
              {overrides.length === 0 ? (
                <TableRow className="cursor-default">
                  <TableCell colSpan={7} className="h-24 text-center hover:bg-transparent">
                    No SLA overrides found
                  </TableCell>
                </TableRow>
              ) : (
                overrides.map((override) => (
                  <SLAOverrideRow key={override.id} override={override} onEdit={handleEdit} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <TablePagination meta={meta} label="overrides" onPageChange={onPageChange} />

      {/* Add Override Modal */}
      <AddSLAOverrideModal
        open={modalOpen}
        onOpenChange={handleModalChange}
        override={editingOverride}
      />
    </div>
  );
}

function SLAOverrideHeaderRow() {
  return (
    <TableRow className="border-b border-border-10 hover:bg-transparent cursor-default">
      <TableHead className="w-[26%] text-xs font-bold text-text-50 uppercase">Scope</TableHead>
      <TableHead className="w-[16%] text-xs font-bold text-text-50 uppercase">Request Type</TableHead>
      <TableHead className="w-[8%] text-xs font-bold text-text-50 uppercase">Target</TableHead>
      <TableHead className="w-[8%] text-xs font-bold text-text-50 uppercase">Warning</TableHead>
      <TableHead className="w-[8%] text-xs font-bold text-text-50 uppercase">Critical</TableHead>
      <TableHead className="w-[18%] text-xs font-bold text-text-50 uppercase">Reason</TableHead>
      <TableHead className="w-[8%] text-xs font-bold text-text-50 uppercase">Actions</TableHead>
    </TableRow>
  );
}

interface SLAOverrideRowProps {
  override: SLAOverride;
  onEdit: (override: SLAOverride) => void;
}

function getScopeContent(override: SLAOverride) {
  const hasClients = (override.clients?.length ?? 0) > 0;
  const hasPayers = (override.payers?.length ?? 0) > 0;
  const clientNames = override.clients?.map((c) => c.name).join(', ') ?? '';
  const payerNames = override.payers?.map((p) => p.name).join(', ') ?? '';

  if (hasClients && hasPayers) {
    const label = `${clientNames} + ${payerNames}`;
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium max-w-full" title={label}>
        <span className="truncate">{label}</span>
      </span>
    );
  }
  if (hasClients) {
    const label = `Client: ${clientNames}`;
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium max-w-full" title={label}>
        <span className="truncate">{label}</span>
      </span>
    );
  }
  if (hasPayers) {
    const label = `Payer: ${payerNames}`;
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium max-w-full" title={label}>
        <span className="truncate">{label}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-glass-bg text-text-50 text-xs font-medium">
      System
    </span>
  );
}

function SLAOverrideRow({ override, onEdit }: Readonly<SLAOverrideRowProps>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const deleteOverride = useDeleteSLAOverride();

  const handleConfirmDelete = () => {
    deleteOverride.mutate(override.id, {
      onSuccess: () => setDeleteDialogOpen(false),
    });
  };

  return (
    <>
      <TableRow className="border-b border-border-5 cursor-default">
        {/* Scope */}
        <TableCell className="px-3 py-3">
          {getScopeContent(override)}
        </TableCell>

        {/* Request Type */}
        <TableCell className="px-3 py-3">
          <span className="block truncate text-foreground">{override.workType?.name ?? override.workTypeId}</span>
        </TableCell>

        {/* Target */}
        <TableCell className="px-3 py-3 font-medium text-foreground">
          {override.overrideTargetDays}d
        </TableCell>

        {/* Warning */}
        <TableCell className="px-3 py-3 text-amber-400">
          {override.overrideWarningDays}d
        </TableCell>

        {/* Critical */}
        <TableCell className="px-3 py-3 text-rose-400">
          {override.overrideCriticalDays}d
        </TableCell>

        {/* Reason */}
        <TableCell className="px-3 py-3">
          <span className="block truncate text-text-70 text-xs">{override.reason}</span>
        </TableCell>

        {/* Actions */}
        <TableCell className="px-3 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(override)}
              className="text-text-50 hover:text-blue-400 transition-colors"
              aria-label="Edit override"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
            </button>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="text-text-50 hover:text-rose-400 transition-colors"
              aria-label="Delete override"
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
        title="Delete SLA Override"
        description="Are you sure you want to delete this SLA override? This action cannot be undone."
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        onConfirm={handleConfirmDelete}
        isLoading={deleteOverride.isPending}
      />
    </>
  );
}

