'use client';

import React from 'react';
import { WaitReasonsListView } from '@/features/settings/components/wait-reasons';
import type { WaitReason } from '@/features/settings/types';
import {
  useWaitReasons,
  useCreateWaitReason,
  useUpdateWaitReason,
  useDeleteWaitReason,
} from '@/features/settings/hooks/use-wait-reasons';
import type {
  CreateWaitReasonPayload,
  UpdateWaitReasonPayload,
} from '@/features/settings/types/wait-reasons-api';
import type { WaitReasonsRequest } from '@/features/settings/api/wait-reasons/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const DEFAULT_LIMIT = 10;

export interface WaitReasonsContentProps {
  request: WaitReasonsRequest;
}

export function WaitReasonsContent({ request }: Readonly<WaitReasonsContentProps>) {
  const [page, setPage] = React.useState(1);

  const { data, isLoading, error } = useWaitReasons({ ...request, page, limit: DEFAULT_LIMIT });
  const createMutation = useCreateWaitReason();
  const updateMutation = useUpdateWaitReason();
  const deleteMutation = useDeleteWaitReason();
  const waitReasons = React.useMemo(
    () => data?.data?.items ?? [],
    [data?.data?.items]
  );
  const meta = data?.data?.meta;
  const metrics = React.useMemo(
    () => ({
      totalReasons: waitReasons.length,
      externalReasons: waitReasons.filter((r) => r.category === 'External').length,
      internalReasons: waitReasons.filter((r) => r.category === 'Internal').length,
      pausingSLA: waitReasons.filter((r) => r.pausesSLA).length,
    }),
    [waitReasons]
  );

  const transformToCreatePayload = (reason: WaitReason): CreateWaitReasonPayload => ({
    code: reason.code ?? reason.id,
    name: reason.label,
    description: reason.description,
    isActive: reason.status === 'Active',
    warningDays: reason.warningDays,
    pauseSla: reason.pausesSLA,
    criticalDays: reason.criticalDays,
    category: reason.category === 'External' ? 'external' : 'internal',
    autoChaseDays: reason.autoChaseDays ?? 0,
  });

  const transformToUpdatePayload = (updates: Partial<WaitReason>): UpdateWaitReasonPayload => {
    const payload: UpdateWaitReasonPayload = {};
    if (updates.label !== undefined) payload.name = updates.label;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.status !== undefined) payload.isActive = updates.status === 'Active';
    if (updates.warningDays !== undefined) payload.warningDays = updates.warningDays;
    if (updates.pausesSLA !== undefined) payload.pauseSla = updates.pausesSLA;
    if (updates.criticalDays !== undefined) payload.criticalDays = updates.criticalDays;
    if (updates.category !== undefined)
      payload.category = updates.category === 'External' ? 'external' : 'internal';
    if (updates.autoChaseDays !== undefined) payload.autoChaseDays = updates.autoChaseDays;
    return payload;
  };

  const handleAddReason = async (reason: WaitReason) => {
    await createMutation.mutateAsync(transformToCreatePayload(reason));
  };

  const handleUpdateReason = async (id: string, updates: Partial<WaitReason>) => {
    await updateMutation.mutateAsync({ id, data: transformToUpdatePayload(updates) });
  };

  const handleDeleteReason = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-rose-400">Failed to load wait reasons. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-violet-400 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-violet-300">Single-Purpose Architecture</p>
            <p className="text-xs text-text-70 mt-1">
              Wait Reasons defines <strong>what states</strong> cases can be in. For{' '}
              <strong>what happens when entering/exiting</strong> states, see Trigger Events. For{' '}
              <strong>chase sequences and escalations</strong>, see Follow-Up Rules.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
      <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-4">
          <p className="text-xs text-text-50 mb-1">Total Reasons</p>
          <p className="text-2xl font-bold text-foreground">{metrics.totalReasons}</p>
        </div>
        <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-4">
          <p className="text-xs text-text-50 mb-1">External</p>
          <p className="text-2xl font-bold text-amber-400">{metrics.externalReasons}</p>
        </div>
        <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-4">
          <p className="text-xs text-text-50 mb-1">Internal</p>
          <p className="text-2xl font-bold text-blue-400">{metrics.internalReasons}</p>
        </div>
        <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-4">
          <p className="text-xs text-text-50 mb-1">Pauses SLA</p>
          <p className="text-2xl font-bold text-violet-400">{metrics.pausingSLA}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-sm font-medium text-amber-300">SLA Clock Behavior</p>
        <p className="text-xs text-text-70 mt-1">
          External waits (payer, board, provider) pause the SLA clock. Internal waits (QA, approvals) keep the clock running.
        </p>
      </div>

      <WaitReasonsListView
        waitReasons={waitReasons}
        isLoading={isLoading}
        onAddReason={handleAddReason}
        onUpdateReason={handleUpdateReason}
        onDeleteReason={handleDeleteReason}
        meta={meta}
        onPageChange={setPage}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-cyan-300">Trigger Events</p>
            <p className="text-xs text-text-70 mt-1">Events fired when entering/exiting wait states</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings/workflow/trigger-events">View Events →</Link>
          </Button>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-blue-300">Follow-Up Rules</p>
            <p className="text-xs text-text-70 mt-1">Chase sequences triggered by wait state events</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings/workflow/follow-up-rules">View Rules →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
