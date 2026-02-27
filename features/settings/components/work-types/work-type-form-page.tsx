'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { 
  workTypeFormResolver,
  workTypeStageFormResolver,
  type WorkTypeFormData,
  type WorkTypeStageFormData,
  defaultWorkTypeValues 
} from '../../validations/work-types-schemas';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { 
  GateRequirementType,
  StageStatus,
  AssignmentRule,
  GateRequirement,
  WorkflowStage,
  WorkTypeFormPageProps,
} from '../../types/work-types';
import { useWorkCategories } from '../../hooks/use-work-categories';
import { useActiveWaitReasons } from '../../hooks/use-wait-reasons';
import { useFollowUpRules } from '../../hooks/use-follow-up-rules';
import { useSettingsSkills } from '../../hooks/use-skills';
import { useCreateWorkType, useUpdateWorkType, useDeleteWorkflowStage, useDeleteGateRequirement, useWorkTypes } from '../../hooks/use-work-types';
import { BasicInfoSection } from './basic-info-section';
import { TimeComplexitySection } from './time-complexity-section';
import { WorkflowStagesSection } from './workflow-stages-section';
import { LinkedSLASection } from './linked-sla-section';
import { LinkedBillingSKUsSection } from './linked-billing-skus-section';

export function WorkTypeFormPage({ workType, onClose }: Readonly<WorkTypeFormPageProps>) {

  const isEditMode = !!workType;

  // Mutation hooks
  const createWorkType = useCreateWorkType();
  const updateWorkType = useUpdateWorkType();
  const deleteWorkflowStage = useDeleteWorkflowStage();
  const deleteGateRequirement = useDeleteGateRequirement();

  // Fetch data for dropdowns
  const { data: workCategoriesData } = useWorkCategories({limit: 100, page: 1});
  const { data: waitReasonsData } = useActiveWaitReasons();
  const { data: followUpRulesData } = useFollowUpRules({ allData: true });
  const { data: skillsData } = useSettingsSkills({ limit: 1000 }); // Fetch with high limit to get all skills
  const { data: allWorkTypesData } = useWorkTypes({ limit: 100, page: 1 }); // Fetch all work types for shortName uniqueness check

  // Extract data from API responses
  const workCategories = workCategoriesData?.data?.items || [];
  const allWorkTypes = allWorkTypesData?.data?.items || [];
  const waitReasons = waitReasonsData?.data || [];
  const followUpRules = followUpRulesData?.data?.items || [];
  const skills = skillsData?.data?.items || [];


  // Initialize form with React Hook Form + Zod validation
  const form = useForm<WorkTypeFormData>({
    resolver: workTypeFormResolver,
    defaultValues: isEditMode && workType
      ? {
          name: workType.name,
          shortName: workType.shortName || '',
          workCategoryId: workType.workCategoryId,
          slaRuleId: workType.slaRuleId || null,
          description: workType.description ?? '',
          expectedDuration: workType.expectedDuration,
          complexityLevel: workType.complexityLevel,
          isActive: workType.isActive,
          version: '1.0',
          providerSignature: workType.providerSignature || false,
          psvRequired: workType.psvRequired || false,
          workflowStages: workType.workflowStages || [],
        }
      : defaultWorkTypeValues,
  });

  // Stage form with validation
  const stageForm = useForm<WorkTypeStageFormData>({
    resolver: workTypeStageFormResolver,
    mode: 'onChange',
    defaultValues: {
      name: '',
      status: StageStatus.ACTIVE_WORK,
      activeTime: 1,
      waitTime: 0,
      slaTarget: 5,
      assignmentRule: AssignmentRule.CASE_OWNER,
      waitReasonId: null,
      followUpRuleId: null,
      approvalGate: null,
      overrideTimeoutThresholds: false,
      overrideWarningDays: 7,
      overrideCriticalDays: 14,
      skillIds: [],
      gateRequirements: [],
    },
  });

  const [showStageForm, setShowStageForm] = React.useState(false);
  const [editingStageIndex, setEditingStageIndex] = React.useState<number | null>(null);
  const [stages, setStages] = React.useState<WorkflowStage[]>([]);
  const [stageErrors, setStageErrors] = React.useState<string | null>(null);

  // Initialize stages from workType when in edit mode
  React.useEffect(() => {
    if (isEditMode && workType?.workflowStages) {
      
      // Convert WorkTypeStage[] to WorkflowStage[] format
      const convertedStages: WorkflowStage[] = workType.workflowStages.map((stage) => {
        // Handle different possible API response formats for skills
        let skillIds: string[] = [];
        
        if (Array.isArray(stage.skillIds)) {
          skillIds = stage.skillIds;
        } else if (Array.isArray(stage.skills)) {
          skillIds = stage.skills.map((skill) =>
            typeof skill === "string" ? skill : skill.id
          );
        }

        return {
          id: stage.id,
          name: stage.name,
          status: stage.status,
          activeTime: stage.activeTime,
          waitTime: stage.waitTime,
          slaTarget: stage.slaTarget,
          assignmentRule: stage.assignmentRule,
          waitReasonId: stage.waitReasonId || null,
          followUpRuleId: stage.followUpRuleId || null,
          approvalGate: stage.approvalGate || null,
          overrideTimeoutThresholds: stage.overrideTimeoutThresholds,
          overrideWarningDays: stage.overrideWarningDays,
          overrideCriticalDays: stage.overrideCriticalDays,
          skillIds,
          gateRequirements: Array.isArray(stage.gateRequirements) ? stage.gateRequirements : [],
        };
      });
      
      setStages(convertedStages);
    }
  }, [isEditMode, workType]);

  // Calculate expected duration from stages' active times
  const calculateExpectedDuration = React.useCallback(() => {
    const totalActiveTime = stages.reduce((sum, stage) => sum + (Number(stage.activeTime) || 0), 0);
    
    // If currently editing a stage, include its active time in the calculation
    if (showStageForm) {
      const currentActiveTime = stageForm.getValues('activeTime') || 0;
      
      if (editingStageIndex !== null) {
        // Replace the old stage's active time with the new one
        const oldStageActiveTime = stages[editingStageIndex]?.activeTime || 0;
        form.setValue('expectedDuration', totalActiveTime - oldStageActiveTime + currentActiveTime);
      } else {
        // Adding new stage - add to total
        form.setValue('expectedDuration', totalActiveTime + currentActiveTime);
      }
    } else {
      // No stage form open - just sum existing stages
      form.setValue('expectedDuration', totalActiveTime);
    }
  }, [stages, showStageForm, editingStageIndex, stageForm, form]);

  // Recalculate when stages change
  React.useEffect(() => {
    calculateExpectedDuration();
  }, [stages, calculateExpectedDuration]);

  const onSubmit = async (data: WorkTypeFormData) => {
    // Validate that stages exist
    if (!stages || stages.length === 0) {
      form.setError('workflowStages', {
        type: 'manual',
        message: 'At least one workflow stage is required',
      });
      return;
    }

    // Check for duplicate work type name (case-insensitive)
    const trimmedName = data.name.trim().toLowerCase();
    const isDuplicateName = allWorkTypes.some(
      (wt) => 
        wt.name.toLowerCase() === trimmedName && 
        (!isEditMode || wt.id !== workType?.id)
    );

    if (isDuplicateName) {
      form.setError('name', {
        type: 'manual',
        message: 'A work type with this name already exists',
      });
      return;
    }

    // Check for duplicate short name (case-insensitive)
    const trimmedShortName = data.shortName.trim().toLowerCase();
    const isDuplicateShortName = allWorkTypes.some(
      (wt) => 
        wt.shortName.toLowerCase() === trimmedShortName && 
        (!isEditMode || wt.id !== workType?.id)
    );

    if (isDuplicateShortName) {
      form.setError('shortName', {
        type: 'manual',
        message: 'A work type with this short name already exists',
      });
      return;
    }

    // Prepare the form data with workflow stages included
    const formDataWithStages: WorkTypeFormData = {
      ...data,
      workflowStages: stages,
    };

    try {
      if (isEditMode && workType) {
        // Update existing work type using server action
        await updateWorkType.mutateAsync({
          id: workType.id,
          data: formDataWithStages,
        });
      } else {
        // Create new work type using server action
        await createWorkType.mutateAsync(formDataWithStages);
      }

      // Close the form after successful save
      onClose();
    } catch {
      // Error is already handled by the mutation hook (toast message)
    }
  };

  const handleSKUToggle = (_sku: string) => {
    // Placeholder for future billing SKU functionality
  };

  const handleAddStage = () => {
    setEditingStageIndex(null);
    setStageErrors(null);
    stageForm.reset({
      name: '',
      status: StageStatus.ACTIVE_WORK,
      activeTime: 1,
      waitTime: 0,
      slaTarget: 5,
      assignmentRule: AssignmentRule.CASE_OWNER,
      waitReasonId: null,
      followUpRuleId: null,
      approvalGate: null,
      overrideTimeoutThresholds: false,
      overrideWarningDays: 7,
      overrideCriticalDays: 14,
      skillIds: [],
      gateRequirements: [],
    });
    setShowStageForm(true);
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = stageForm.getValues('skillIds') || [];
    stageForm.setValue(
      'skillIds',
      currentSkills.includes(skill)
        ? currentSkills.filter((s) => s !== skill)
        : [...currentSkills, skill]
    );
  };

  const handleAddGateRequirement = () => {
    const currentRequirements = stageForm.getValues('gateRequirements') || [];
    const newRequirement: GateRequirement = {
      type: GateRequirementType.DOCUMENT,
      description: '',
      isRequired: false,
    };
    stageForm.setValue('gateRequirements', [...currentRequirements, newRequirement]);
  };

  const handleUpdateGateRequirement = (index: number, field: keyof GateRequirement, value: string | boolean) => {
    const currentRequirements = stageForm.getValues('gateRequirements') || [];
    const updated = currentRequirements.map((req, i) =>
      i === index ? { ...req, [field]: value } : req
    );
    stageForm.setValue('gateRequirements', updated);
  };

  const handleDeleteGateRequirement = async (idOrIndex: number | string) => {
    const currentRequirements = stageForm.getValues('gateRequirements') || [];
    let requirementToDelete: GateRequirement | undefined;
    let indexToDelete: number;

    // Determine if we're deleting by ID or by index
    if (typeof idOrIndex === 'string') {
      // Delete by ID - find the gate requirement with this ID
      indexToDelete = currentRequirements.findIndex(req => req.id === idOrIndex);
      if (indexToDelete === -1) {
        return;
      }
      requirementToDelete = currentRequirements[indexToDelete];
    } else {
      // Delete by index
      indexToDelete = idOrIndex;
      requirementToDelete = currentRequirements[indexToDelete];
    }

    if (!requirementToDelete) {
      console.error('Gate requirement not found');
      return;
    }

    // If gate requirement has an ID, call the API to delete it
    if (requirementToDelete.id) {
      try {
        await deleteGateRequirement.mutateAsync(requirementToDelete.id);
      } catch (error) {
        // Error is already handled by the mutation hook (toast message)
        console.error('Failed to delete gate requirement:', error);
        return; // Don't remove from local state if API call failed
      }
    }

    // Remove from local state (either after successful API call or if no ID exists)
    const updatedRequirements = currentRequirements.filter((_, i) => i !== indexToDelete);
    stageForm.setValue('gateRequirements', updatedRequirements);
  };

  const handleEditStage = (index: number) => {
    setEditingStageIndex(index);
    setStageErrors(null);
    const stage = stages[index];
    stageForm.reset({
      ...stage,
      activeTime: Number(stage.activeTime),
      waitTime: Number(stage.waitTime),
      slaTarget: Number(stage.slaTarget),
    });
    setShowStageForm(true);
  };

  const handleDeleteStage = async (idOrIndex: number | string) => {
    let stageToDelete: WorkflowStage | undefined;
    let indexToDelete: number;

    // Determine if we're deleting by ID or by index
    if (typeof idOrIndex === 'string') {
      // Delete by ID - find the stage with this ID
      indexToDelete = stages.findIndex(stage => stage.id === idOrIndex);
      if (indexToDelete === -1) {
        console.error('Stage with ID not found:', idOrIndex);
        return;
      }
      stageToDelete = stages[indexToDelete];
    } else {
      // Delete by index
      indexToDelete = idOrIndex;
      stageToDelete = stages[indexToDelete];
    }

    if (!stageToDelete) {
      console.error('Stage not found');
      return;
    }

    // If stage has an ID, call the API to delete it
    if (stageToDelete.id) {
      try {
        await deleteWorkflowStage.mutateAsync(stageToDelete.id);
      } catch (error) {
        // Error is already handled by the mutation hook (toast message)
        console.error('Failed to delete workflow stage:', error);
        return; // Don't remove from local state if API call failed
      }
    }

    // Remove from local state (either after successful API call or if no ID exists)
    const updatedStages = stages.filter((_, i) => i !== indexToDelete);
    setStages(updatedStages);
    
    // Sync with form's workflowStages field
    form.setValue('workflowStages', updatedStages as WorkflowStage[]);
    
    // If no stages remain, show validation error
    if (updatedStages.length === 0) {
      form.setError('workflowStages', {
        type: 'manual',
        message: 'At least one workflow stage is required',
      });
    }
  };

  const handleDeleteStageFromForm = async (stageId: string) => {
    // Delete the stage by ID (which will call the API)
    await handleDeleteStage(stageId);
    
    setShowStageForm(false);
    setEditingStageIndex(null);
    setStageErrors(null);
    stageForm.clearErrors();
  };

  const handleSaveStage = async () => {
    const isValid = await stageForm.trigger();
    
    if (!isValid) {
      setStageErrors('Please fix the validation errors before saving.');
      return;
    }

    const stageData = stageForm.getValues();
    
    // Check for duplicate stage names
    const existingStages = editingStageIndex !== null 
      ? stages.filter((_, i) => i !== editingStageIndex)
      : stages;
    
    const isDuplicate = existingStages.some(
      (stage) => stage.name.toLowerCase().trim() === stageData.name.toLowerCase().trim()
    );

    if (isDuplicate) {
      stageForm.setError('name', {
        type: 'manual',
        message: 'A stage with this name already exists',
      });
      setStageErrors('Stage name must be unique.');
      return;
    }

    let updatedStages: WorkflowStage[];
    if (editingStageIndex !== null) {
      updatedStages = stages.map((stage, i) => 
        i === editingStageIndex ? stageData as WorkflowStage : stage
      );
    } else {
      updatedStages = [...stages, stageData as WorkflowStage];
    }
    
    // Update local stages state
    setStages(updatedStages);
    
    // Sync with form's workflowStages field
    form.setValue('workflowStages', updatedStages as WorkflowStage[]);
    
    // Clear the workflowStages error since we now have at least one stage
    form.clearErrors('workflowStages');
    
    setShowStageForm(false);
    setEditingStageIndex(null);
    setStageErrors(null);
  };

  const handleCancelStage = () => {
    setShowStageForm(false);
    setEditingStageIndex(null);
    setStageErrors(null);
    stageForm.clearErrors();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-xl text-text-50 hover:text-foreground"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {isEditMode ? 'Edit Work Type' : 'Create New Work Type'}
          </h2>
          <p className="text-sm text-text-50">
            Configure work type details, workflow stages, and SLA targets
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Basic Information */}
          <BasicInfoSection form={form} workCategories={workCategories} />

          {/* Section 2: Time & Complexity */}
          <TimeComplexitySection form={form} />

          {/* Section 3: Workflow Stages */}
          <WorkflowStagesSection
            form={form}
            stageForm={stageForm}
            stages={stages}
            showStageForm={showStageForm}
            editingStageIndex={editingStageIndex}
            stageErrors={stageErrors}
            skills={skills}
            waitReasons={waitReasons}
            followUpRules={followUpRules}
            onAddStage={handleAddStage}
            onEditStage={handleEditStage}
            onDeleteStage={handleDeleteStage}
            onDeleteStageFromForm={handleDeleteStageFromForm}
            onSaveStage={handleSaveStage}
            onCancelStage={handleCancelStage}
            onSkillToggle={handleSkillToggle}
            onAddGateRequirement={handleAddGateRequirement}
            onUpdateGateRequirement={handleUpdateGateRequirement}
            onDeleteGateRequirement={handleDeleteGateRequirement}
            onActiveTimeChange={calculateExpectedDuration}
          />

          {/* Section 4: Linked SLA Rule */}
          <LinkedSLASection form={form} />

          {/* Section 5: Linked Billing SKUs */}
          <LinkedBillingSKUsSection onToggle={handleSKUToggle} />

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createWorkType.isPending || updateWorkType.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createWorkType.isPending || updateWorkType.isPending}
              className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700"
            >
              {createWorkType.isPending || updateWorkType.isPending
                ? 'Saving...'
                : isEditMode
                ? 'Save Changes'
                : 'Create Work Type'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
