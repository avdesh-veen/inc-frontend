/**
 * WorkflowStagesSection Component
 * 
 * Manages workflow stages section including the list of stages and the form
 * for adding/editing stages.
 */

'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { WorkTypeFormData, WorkTypeStageFormData } from '../../validations/work-types-schemas';
import type { SkillApiItem } from '../../types/skills';
import type { WaitReason } from '../../types/wait-reasons';
import type { FollowUpRule } from '../../types/follow-up-rules';
import { Button } from '@/components/ui/button';
import { WorkflowStagesList } from './workflow-stages-list';
import { WorkflowStageForm } from './workflow-stage-form';
import { WorkflowStage, GateRequirement } from '../../types/work-types';

interface WorkflowStagesSectionProps {
  form: UseFormReturn<WorkTypeFormData>;
  stageForm: UseFormReturn<WorkTypeStageFormData>;
  stages: WorkflowStage[];
  showStageForm: boolean;
  editingStageIndex: number | null;
  stageErrors: string | null;
  skills: SkillApiItem[];
  waitReasons: WaitReason[];
  followUpRules: FollowUpRule[];
  onAddStage: () => void;
  onEditStage: (index: number) => void;
  onDeleteStage: (idOrIndex: number | string) => void;
  onDeleteStageFromForm?: (id: string) => void;
  onSaveStage: () => void;
  onCancelStage: () => void;
  onSkillToggle: (skillId: string) => void;
  onAddGateRequirement: () => void;
  onUpdateGateRequirement: (index: number, field: keyof GateRequirement, value: string | boolean) => void;
  onDeleteGateRequirement: (idOrIndex: number | string) => void;
  onActiveTimeChange?: () => void;
}

export function WorkflowStagesSection({
  form,
  stageForm,
  stages,
  showStageForm,
  editingStageIndex,
  stageErrors,
  skills,
  waitReasons,
  followUpRules,
  onAddStage,
  onEditStage,
  onDeleteStage,
  onDeleteStageFromForm,
  onSaveStage,
  onCancelStage,
  onSkillToggle,
  onAddGateRequirement,
  onUpdateGateRequirement,
  onDeleteGateRequirement,
  onActiveTimeChange,
}: Readonly<WorkflowStagesSectionProps>) {
  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Workflow Stages <span className="text-destructive ml-1">*</span>
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAddStage}
          className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Stage
        </Button>
      </div>
      <p className="text-sm text-text-70 mb-4">
        Define stages with time tracking, gate requirements, and assignment rules
      </p>

      {/* Workflow Stages Validation Error */}
      {form.formState.errors.workflowStages && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {form.formState.errors.workflowStages.message}
        </div>
      )}

      {/* Stages List */}
      <WorkflowStagesList
        stages={stages}
        onEdit={onEditStage}
        onDelete={onDeleteStage}
      />

      {/* Empty State - Only show when no stages AND form is closed */}
      {stages.length === 0 && !showStageForm && (
        <div className="text-center py-8 text-text-50">
          No workflow stages defined. Add stages to configure the workflow.
        </div>
      )}

      {/* Stage Form Modal/Inline */}
      {showStageForm && (
        <WorkflowStageForm
          stageForm={stageForm}
          editingStageIndex={editingStageIndex}
          stageErrors={stageErrors}
          skills={skills}
          waitReasons={waitReasons}
          followUpRules={followUpRules}
          onSave={onSaveStage}
          onCancel={onCancelStage}
          onSkillToggle={onSkillToggle}
          onAddGateRequirement={onAddGateRequirement}
          onUpdateGateRequirement={onUpdateGateRequirement}
          onDeleteGateRequirement={onDeleteGateRequirement}
          onDeleteStage={onDeleteStageFromForm}
          onActiveTimeChange={onActiveTimeChange}
        />
      )}
    </div>
  );
}
