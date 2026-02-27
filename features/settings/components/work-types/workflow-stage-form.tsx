/**
 * WorkflowStageForm Component
 * 
 * Inline form for adding or editing a workflow stage
 * with all stage configuration fields including gate requirements.
 */

'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { WorkTypeStageFormData } from '../../validations/work-types-schemas';
import type { SkillApiItem } from '../../types/skills';
import type { WaitReason } from '../../types/wait-reasons';
import type { FollowUpRule } from '../../types/follow-up-rules';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  STAGE_TYPES,
  ASSIGNMENT_RULES,
  APPROVAL_GATES,
  GATE_REQUIREMENT_TYPES,
  GateRequirement,
} from '../../types/work-types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Trash } from '@hugeicons/core-free-icons';

interface WorkflowStageFormProps {
  stageForm: UseFormReturn<WorkTypeStageFormData>;
  editingStageIndex: number | null;
  stageErrors: string | null;
  skills: SkillApiItem[];
  waitReasons: WaitReason[];
  followUpRules: FollowUpRule[];
  onSave: () => void;
  onCancel: () => void;
  onSkillToggle: (skillId: string) => void;
  onAddGateRequirement: () => void;
  onUpdateGateRequirement: (index: number, field: keyof GateRequirement, value: string | boolean) => void;
  onDeleteGateRequirement: (idOrIndex: number | string) => void;
  onDeleteStage?: (id: string) => void;
  onActiveTimeChange?: () => void;
}

export function WorkflowStageForm({
  stageForm,
  editingStageIndex,
  stageErrors,
  skills,
  waitReasons,
  followUpRules,
  onSave,
  onCancel,
  onSkillToggle,
  onAddGateRequirement,
  onUpdateGateRequirement,
  onDeleteGateRequirement,
  onDeleteStage,
  onActiveTimeChange,
}: Readonly<WorkflowStageFormProps>) {
  
  const stageId = stageForm.getValues('id');
  const canDelete = editingStageIndex !== null && stageId;

  return (
    <Form {...stageForm}>
      <div className="mt-4 rounded-lg bg-glass-bg border border-violet-500/30 p-4">
        <div className="flex justify-between">
        <h4 className="text-sm font-semibold text-violet-300 mb-4">
          {editingStageIndex !== null ? 'Edit Stage' : 'Add New Stage'}
        </h4>

        {canDelete && onDeleteStage && stageId && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDeleteStage(stageId)}
            className="h-6 w-6 text-text-50 hover:text-rose-300"
            title="Delete stage"
          >
            <HugeiconsIcon icon={Trash} className="w-4 h-4" />
          </Button>
        )}

        </div>
        
        {stageErrors && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {stageErrors}
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-4">
          {/* Stage Name */}
          <div className="col-span-2">
            <FormField
              control={stageForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-text-50">
                    Stage name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Initial Review"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Stage Type */}
          <div className="col-span-2">
            <FormField
              control={stageForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-text-50">
                    Stage Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STAGE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Active Time */}
          <div>
            <FormField
              control={stageForm.control}
              name="activeTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-text-50">
                    Active Time (min) <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                        onActiveTimeChange?.();
                      }}
                      onFocus={(e) => e.target.select()}
                      min="1"
                      step="1"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Wait Time */}
          <div>
            <FormField
              control={stageForm.control}
              name="waitTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-text-50">Wait Time (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      onFocus={(e) => e.target.select()}
                      min="0"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* SLA Target */}
          <div>
            <FormField
              control={stageForm.control}
              name="slaTarget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-text-50">
                    SLA Target (days) <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      onFocus={(e) => e.target.select()}
                      min="1"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Assignment Rule */}
          <div>
            <FormField
              control={stageForm.control}
              name="assignmentRule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-text-50">
                    Assignment Rule <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ASSIGNMENT_RULES.map((rule) => (
                        <SelectItem key={rule.value} value={rule.value}>
                          {rule.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Workflow Building Blocks */}
        <div className="mt-4 pt-4 border-t border-border-10">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Workflow Building Blocks</span>
            <span className="text-[10px] text-text-50">(⚙ pulls from Settings)</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Wait Reason */}
            <div>
              <FormField
                control={stageForm.control}
                name="waitReasonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-text-50">Wait Reason</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'none' ? null : value)} 
                      value={field.value ?? 'none'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="— None —" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">— None —</SelectItem>
                        {waitReasons.map((reason) => (
                          <SelectItem key={reason.id} value={reason.id}>
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Follow-Up Rule */}
            <div>
              <FormField
                control={stageForm.control}
                name="followUpRuleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-text-50">Follow-Up Rule</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'none' ? null : value)} 
                      value={field.value ?? 'none'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="— None —" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">— None —</SelectItem>
                        {followUpRules.map((rule) => (
                          <SelectItem key={rule.id} value={rule.id}>
                            {rule.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Approval Gate */}
            <div>
              <FormField
                control={stageForm.control}
                name="approvalGate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-text-50">Approval Gate</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'none' ? null : value)} 
                      value={field.value ?? 'none'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="— No Approval —" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">— No Approval —</SelectItem>
                        {APPROVAL_GATES.map((gate) => (
                          <SelectItem key={gate.value} value={gate.value}>
                            {gate.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Override Timeout Thresholds */}
          <div className="mt-3">
            <FormField
              control={stageForm.control}
              name="overrideTimeoutThresholds"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-[10px] text-text-50 cursor-pointer">
                    Override timeout thresholds
                  </FormLabel>
                  
                  {field.value && (
                    <div className="flex items-center gap-2">
                      <FormField
                        control={stageForm.control}
                        name="overrideWarningDays"
                        render={({ field: warningField }) => (
                          <FormItem className="flex items-center gap-1 space-y-0">
                            <FormLabel className="text-[10px] text-amber-400">Warning:</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...warningField}
                                onChange={(e) => warningField.onChange(Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                                min="1"
                                className="w-12 px-1 py-0.5 h-6 text-[10px] text-center"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={stageForm.control}
                        name="overrideCriticalDays"
                        render={({ field: criticalField }) => (
                          <FormItem className="flex items-center gap-1 space-y-0">
                            <FormLabel className="text-[10px] text-rose-400">Critical:</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...criticalField}
                                onChange={(e) => criticalField.onChange(Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                                min="1"
                                className="w-12 px-1 py-0.5 h-6 text-[10px] text-center"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <span className="text-[10px] text-text-50">days</span>
                    </div>
                  )}
                </FormItem>
              )}
            />
            {stageForm.formState.errors.overrideCriticalDays && (
              <p className="text-xs text-destructive mt-1">
                {stageForm.formState.errors.overrideCriticalDays.message}
              </p>
            )}
          </div>
        </div>

        {/* Required Skills */}
        <div className="mt-4 pt-4 border-t border-border-10">
          <FormField
            control={stageForm.control}
            name="skillIds"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <FormLabel className="text-text-50">Required Skills:</FormLabel>
                  {skills.map((skill) => (
                    <label key={skill.id} className="flex items-center gap-1 cursor-pointer">
                      <Checkbox
                        checked={field.value?.includes(skill.id)}
                        onCheckedChange={() => onSkillToggle(skill.id)}
                      />
                      <span className="text-text-70">{skill.name}</span>
                    </label>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-text-50 text-xs">No skills available</span>
                  )}
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Gate Requirements */}
        <div className="mt-4 pt-4 border-t border-border-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Gate Requirements</span>
              <span className="text-[10px] text-text-50">(Checklist to advance stage)</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAddGateRequirement}
              className="h-6 px-2 text-xs text-cyan-300 hover:text-cyan-200"
            >
              + Add
            </Button>
          </div>

          <FormField
            control={stageForm.control}
            name="gateRequirements"
            render={({ field }) => (
              <FormItem>
                {field.value && field.value.length > 0 && (
                  <div className="space-y-2">
                    {field.value.map((requirement, index) => (
                      <div key={requirement.id || index} className="flex items-center gap-2">
                        <Select
                          value={requirement.type}
                          onValueChange={(value) => onUpdateGateRequirement(index, 'type', value)}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GATE_REQUIREMENT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={requirement.description}
                          onChange={(e) => onUpdateGateRequirement(index, 'description', e.target.value)}
                          placeholder="Requirement description"
                          className="flex-1 h-8 text-xs"
                        />
                        <div className="flex items-center gap-1">
                          <Checkbox
                            checked={requirement.isRequired}
                            onCheckedChange={(checked) => onUpdateGateRequirement(index, 'isRequired', !!checked)}
                          />
                          <span className="text-xs text-cyan-400">Req</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteGateRequirement(requirement.id || index)}
                          className="h-8 w-8 text-text-50 hover:text-rose-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {(!field.value || field.value.length === 0) && (
                  <p className="text-xs text-text-50 text-center py-2">
                    No gate requirements defined. Click &quot;+ Add&quot; to add requirements.
                  </p>
                )}
                <FormMessage className="text-xs mt-2" />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border-10">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSave}
            className="bg-emerald-500 hover:bg-emerald-400"
          >
            {editingStageIndex !== null ? 'Update Stage' : 'Add Stage'}
          </Button>
        </div>
      </div>
    </Form>
  );
}
