/**
 * WorkflowStagesList Component
 * 
 * Displays a list of configured workflow stages with edit/delete actions.
 */

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WorkflowStage, StageStatus, AssignmentRule, ASSIGNMENT_RULE_LABELS } from '../../types/work-types';

interface WorkflowStagesListProps {
  stages: WorkflowStage[];
  onEdit: (index: number) => void;
  onDelete: (idOrIndex: number | string) => void;
}

export function WorkflowStagesList({
  stages,
  onEdit,
  onDelete,
}: Readonly<WorkflowStagesListProps>) {
  if (stages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {stages.map((stage, index) => (
        <div
          key={stage.id || `${stage.name}`}
          className="rounded-lg bg-glass-bg border border-border-10 p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-xs font-bold">
                {index + 1}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">{stage.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-medium',
                    stage.status === StageStatus.ACTIVE_WORK
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-amber-500/20 text-amber-300'
                  )}>
                    {stage.status === StageStatus.ACTIVE_WORK ? 'Active Work' : 'Waiting'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEdit(index)}
                className="h-8 w-8 text-text-50 hover:text-foreground"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDelete(stage.id || index)}
                className="h-8 w-8 text-text-50 hover:text-rose-300 hover:bg-rose-500/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-text-50">Active Time:</span>
              <span className="ml-1 text-foreground font-medium">{stage.activeTime} min</span>
            </div>
            <div>
              <span className="text-text-50">Wait Time:</span>
              <span className="ml-1 text-foreground font-medium">{stage.waitTime} days</span>
            </div>
            <div>
              <span className="text-text-50">SLA Target:</span>
              <span className="ml-1 text-foreground font-medium">{stage.slaTarget} days</span>
            </div>
            <div>
              <span className="text-text-50">Assignment:</span>
              <span className="ml-1 text-foreground font-medium">
                {ASSIGNMENT_RULE_LABELS[stage.assignmentRule as AssignmentRule] ?? stage.assignmentRule}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
