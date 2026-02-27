'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useAssignmentStore } from '@/features/settings/hooks/use-assignment-store';
import {
  useCreateRoutingRule,
  useUpdateRoutingRule,
} from '@/features/settings/hooks/use-assignment';
import { useWorkCategories } from '@/features/settings/hooks/use-work-categories';
import {
  routingRuleSchema,
  type RoutingRuleFormData,
} from '@/features/settings/validations/assignment-schemas';
import {
  PayerType,
  ClientTier,
  RoutingAssignmentMode,
  RoutingSkills,
  MinProficiency,
} from '@/features/settings/types/assignment';
import {
  getPayerTypeLabel,
  getPayerTypeDropdownLabel,
  getClientTierLabel,
  getClientTierDropdownLabel,
  getRoutingSkillsLabel,
  getMinProficiencyLabel,
  getAssignmentModeLabel,
} from './routing-rule-helpers';

// Static options for form dropdowns
const PAYER_TYPES = Object.values(PayerType);
const CLIENT_TIERS = Object.values(ClientTier);
const REQUIRED_SKILLS = Object.values(RoutingSkills);
const MIN_PROFICIENCY_LEVELS = [
  { name: MinProficiency.TRAINEE, level: 1 },
  { name: MinProficiency.COMPETENT, level: 2 },
  { name: MinProficiency.EXPERT, level: 3 },
];
const ASSIGNMENT_MODES = [
  { id: RoutingAssignmentMode.SKILL_MATCHED, desc: 'Assign to best skill match + load balance' },
  { id: RoutingAssignmentMode.DEDICATED, desc: 'Assign to dedicated team only' },
  { id: RoutingAssignmentMode.LOAD_BALANCED, desc: 'Distribute evenly by workload' },
  { id: RoutingAssignmentMode.LEAST_BUSY, desc: 'Assign to analyst with least current work' },
];

export function RoutingRuleFormContent() {
  const { isRoutingRuleFormOpen, selectedRule, closeRoutingRuleForm } = useAssignmentStore();
  const createRule = useCreateRoutingRule();
  const updateRule = useUpdateRoutingRule();
  const { data: workCategoriesResponse } = useWorkCategories();

  const workCategories = workCategoriesResponse?.data?.items || [];
  const isEditing = !!selectedRule;

  const form = useForm<RoutingRuleFormData>({
    resolver: zodResolver(routingRuleSchema),
    defaultValues: {
      rulePriority: 1,
      isActive: true,
      isUrgent: false,
    }
  });

  // Reset form when dialog opens with selected rule
  useEffect(() => {
    if (isRoutingRuleFormOpen && selectedRule) {
      form.reset({
        rulePriority: selectedRule.rulePriority,
        workCategory: selectedRule.workCategory,
        payerType: selectedRule.payerType,
        clientTier: selectedRule.clientTier,
        isUrgent: selectedRule.isUrgent,
        routingSkills: selectedRule.routingSkills,
        minProficiency: selectedRule.minProficiency,
        assignmentMode: selectedRule.assignmentMode,
        isActive: selectedRule.isActive,
      });
    } else if (isRoutingRuleFormOpen && !selectedRule) {
      // Reset to default form for new rule
      form.reset({
        rulePriority: 1,
        isActive: true,
        isUrgent: false,
      });
    }
  }, [isRoutingRuleFormOpen, selectedRule, form]);

  const onSubmit = async (data: RoutingRuleFormData) => {
    if (isEditing && selectedRule) {
      updateRule.mutate(
        { id: selectedRule.id, data },
        {
          onSuccess: () => {
            closeRoutingRuleForm();
          },
        }
      );
    } else {
      createRule.mutate(data, {
        onSuccess: () => {
          closeRoutingRuleForm();
        },
      });
    }
  };

  const handleClose = () => {
    closeRoutingRuleForm();
    form.reset();
  };

  const isSaving = createRule.isPending || updateRule.isPending;
  let submitButtonLabel: string;
  if (isSaving) {
    submitButtonLabel = 'Saving...';
  } else if (isEditing) {
    submitButtonLabel = 'Update Rule';
  } else {
    submitButtonLabel = 'Create Rule';
  }

  const watchedFields = useWatch<RoutingRuleFormData>({
    control: form.control,
    defaultValue: form.getValues(),
  });

  return (
    <>
      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mx-4 mb-4">
        <div className="flex items-start gap-3">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="w-5 h-5 text-cyan-400 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-medium text-cyan-300">DMN Routing Rule</p>
            <p className="text-xs text-text-70 mt-1">
              Rules are evaluated by priority (lowest first). Use{' '}
              <code className="text-cyan-400">*</code> to match any value in a condition. The
              rule outputs determine how matching cases are assigned.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4 w-full">
          {/* Three-column grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 w-full min-w-0">
            {/* Column 1: Priority & Conditions */}
            <Card className="p-4 space-y-4">
              <h3 className="text-sm font-bold text-text-70 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-xs">
                  1
                </span>
                Priority & Conditions
              </h3>

              {/* Priority */}
              <FormField
                control={form.control}
                name="rulePriority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Rule Priority <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={99}
                        {...field}
                        onChange={(e) => {
                          const { value } = e.target;
                          if (value === '') {
                            field.onChange(undefined);
                            return;
                          }
                          const parsed = parseInt(value, 10);
                          field.onChange(isNaN(parsed) ? undefined : parsed);
                        }}
                        onBlur={() => {
                          const current = parseInt(String(field.value), 10);
                          if (isNaN(current) || current < 1) field.onChange(1);
                          else if (current > 99) field.onChange(99);
                          else field.onChange(current);
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <p className="text-xs text-text-50">(lower = higher priority)</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Work Category */}
              <FormField
                control={form.control}
                name="workCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Category</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'null' ? null : value)} 
                      value={field.value === null ? 'null' : field.value || 'null'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">Any</SelectItem>
                        {workCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payer Type */}
              <FormField
                control={form.control}
                name="payerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payer Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payer type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYER_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {getPayerTypeDropdownLabel(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Client Tier */}
              <FormField
                control={form.control}
                name="clientTier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Tier</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CLIENT_TIERS.map((tier) => (
                          <SelectItem key={tier} value={tier}>
                            {getClientTierDropdownLabel(tier)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Urgent */}
              <FormField
                control={form.control}
                name="isUrgent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Is Urgent?</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            {/* Column 2: Routing Outputs */}
            <Card className="p-4 space-y-4">
              <h3 className="text-sm font-bold text-text-70 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-xs">
                  2
                </span>
                Routing Outputs
              </h3>

              {/* Routing Skills */}
              <FormField
                control={form.control}
                name="routingSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Routing Skills</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skills" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REQUIRED_SKILLS.map((skill) => (
                          <SelectItem key={skill} value={skill}>
                            {getRoutingSkillsLabel(skill)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Minimum Proficiency */}
              <FormField
                control={form.control}
                name="minProficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Proficiency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select proficiency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MIN_PROFICIENCY_LEVELS.map((level) => (
                          <SelectItem key={level.name} value={level.name}>
                            {getMinProficiencyLabel(level.name)} (Level {level.level})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assignment Mode */}
              <FormField
                control={form.control}
                name="assignmentMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Mode</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ASSIGNMENT_MODES.map((mode) => (
                          <SelectItem key={mode.id} value={mode.id}>
                            {getAssignmentModeLabel(mode.id)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mode Descriptions */}
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mt-2">
                <p className="text-[10px] text-emerald-300">
                  <strong>Skill Match:</strong> By skill + load balance
                </p>
                <p className="text-[10px] text-emerald-300">
                  <strong>Dedicated:</strong> Assigned team only
                </p>
                <p className="text-[10px] text-emerald-300">
                  <strong>Load Balanced:</strong> Even distribution
                </p>
              </div>
            </Card>

            {/* Column 3: Rule Preview & Status */}
            <div className="space-y-4">
              {/* Rule Preview */}
              <Card className="p-4">
                <h3 className="text-sm font-bold text-text-70 flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs">
                    3
                  </span>
                  Rule Preview
                </h3>

                <div className="p-3 rounded-lg bg-glass-bg border border-border-10">
                  <p className="text-xs text-text-50 mb-2">This rule will match:</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-foreground">
                      <span className="text-cyan-400">IF</span> Work Category ={' '}
                      <span className="text-emerald-400">
                        {watchedFields.workCategory === null || !watchedFields.workCategory ? '*' : 
                          workCategories.find(cat => cat.id === watchedFields.workCategory)?.name || 'Not selected'}
                      </span>
                    </p>
                    <p className="text-foreground">
                      <span className="text-cyan-400">AND</span> Payer Type ={' '}
                      <span className="text-emerald-400">{watchedFields.payerType ? getPayerTypeLabel(watchedFields.payerType) : 'Not selected'}</span>
                    </p>
                    <p className="text-foreground">
                      <span className="text-cyan-400">AND</span> Client Tier ={' '}
                      <span className="text-emerald-400">{watchedFields.clientTier ? getClientTierLabel(watchedFields.clientTier) : 'Not selected'}</span>
                    </p>
                    <p className="text-foreground">
                      <span className="text-cyan-400">AND</span> Is Urgent ={' '}
                      <span className="text-emerald-400">{watchedFields.isUrgent ? 'Yes' : 'No'}</span>
                    </p>
                    <p className="text-foreground mt-2">
                      <span className="text-violet-400">THEN</span> Route to{' '}
                      <span className="text-amber-400">{watchedFields.routingSkills ? getRoutingSkillsLabel(watchedFields.routingSkills) : 'Not selected'}</span>
                    </p>
                  </div>
                </div>
              </Card>

              {/* Status */}
              <Card className="p-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Rule Active</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createRule.isPending || updateRule.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createRule.isPending || updateRule.isPending}
              className="gap-2"
            >
              <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
              {submitButtonLabel}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
