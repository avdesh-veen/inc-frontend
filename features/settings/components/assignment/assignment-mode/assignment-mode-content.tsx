'use client';

import { useMemo, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AssignmentModeCard } from './assignment-mode-card';
import { AssignmentModeMetrics } from './assignment-mode-metrics';
import { AssignmentPreferencesForm } from './assignment-preferences-form';
import {
  useActiveAssignmentMode,
  useAssignmentModes,
  useUpdateAssignmentMode,
} from '@/features/settings/hooks/use-assignment';
import {
  assignmentModeFormSchema,
  type AssignmentModeFormData,
} from '@/features/settings/validations/assignment-schemas';
import type { AssignmentMode } from '@/features/settings/types/assignment';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to get human-readable mode name
function getModeName(type: AssignmentMode): string {
  const nameMap: Record<AssignmentMode, string> = {
    roundRobin: 'Round Robin',
    loadBalance: 'Load Balanced',
    manual: 'Manual Only',
  };
  return nameMap[type] || type;
}

// Helper function to get mode description
function getModeDescription(type: AssignmentMode): string {
  const descMap: Record<AssignmentMode, string> = {
    roundRobin: 'Distribute evenly across all qualified analysts',
    loadBalance: 'Assign to analyst with lowest current workload',
    manual: 'All assignments require supervisor selection',
  };
  return descMap[type] || '';
}

export function AssignmentModeContent() {
  const { data: activeMode, isLoading: isLoadingActive, error: activeError } = useActiveAssignmentMode();
  const { data: allModes, isLoading: isLoadingModes, error: modesError } = useAssignmentModes();
  const updateMode = useUpdateAssignmentMode();

  // Generate mode options from API data
  const modeOptions = useMemo(() => {
    if (!allModes || !Array.isArray(allModes)) {
      return [];
    }
    
    const options = allModes.map((mode) => ({
      id: mode.type,
      name: getModeName(mode.type),
      description: getModeDescription(mode.type),
    }));
    
    return options;
  }, [allModes]);

  const form = useForm<AssignmentModeFormData>({
    resolver: zodResolver(assignmentModeFormSchema),
    values: activeMode
      ? {
          type: activeMode.type,
          considerAnalystAvailability: activeMode.considerAnalystAvailability,
          preferRecentTaskAnalyst: activeMode.preferRecentTaskAnalyst,
          autoReassignOnAbsence: activeMode.autoReassignOnAbsence,
          clientAffinityEnabled: activeMode.clientAffinityEnabled,
        }
      : undefined,
  });

  const selectedModeType = useWatch({ control: form.control, name: 'type' });

  // Update preferences when mode changes
  useEffect(() => {
    if (!allModes || !selectedModeType) return;

    // Find the selected mode's configuration
    const selectedModeConfig = allModes.find((mode) => mode.type === selectedModeType);
    
    if (selectedModeConfig) {
      
      // Update form values with the selected mode's preferences
      form.setValue('considerAnalystAvailability', selectedModeConfig.considerAnalystAvailability);
      form.setValue('preferRecentTaskAnalyst', selectedModeConfig.preferRecentTaskAnalyst);
      form.setValue('autoReassignOnAbsence', selectedModeConfig.autoReassignOnAbsence);
      form.setValue('clientAffinityEnabled', selectedModeConfig.clientAffinityEnabled);
    }
  }, [selectedModeType, allModes, form]);

  const handleModeChange = (mode: AssignmentMode) => {
    form.setValue('type', mode);
  };

  const handlePreferenceChange = (
    key: keyof Omit<AssignmentModeFormData, 'type'>,
    value: boolean
  ) => {
    form.setValue(key, value);
  };

  const onSubmit = (formData: AssignmentModeFormData) => {
    // Find the mode ID for the selected type
    const selectedMode = allModes?.find((mode) => mode.type === formData.type);
    
    if (!selectedMode?.id) {
      console.error('No mode found for type:', formData.type);
      return;
    }
    
    // Check if the selected mode is different from the active mode
    const isChangingActiveMode = formData.type !== activeMode?.type;
    
    // Prepare the payload according to API specification
    const payload: {
      considerAnalystAvailability: boolean;
      preferRecentTaskAnalyst: boolean;
      autoReassignOnAbsence: boolean;
      clientAffinityEnabled: boolean;
      isActive?: boolean;
    } = {
      considerAnalystAvailability: formData.considerAnalystAvailability,
      preferRecentTaskAnalyst: formData.preferRecentTaskAnalyst,
      autoReassignOnAbsence: formData.autoReassignOnAbsence,
      clientAffinityEnabled: formData.clientAffinityEnabled,
    };
    
    // If changing to a different mode, set isActive to true
    // This will automatically deactivate other modes per API documentation
    if (isChangingActiveMode) {
      payload.isActive = true;
    }
    
    
    updateMode.mutate({
      id: selectedMode.id,
      data: payload,
    });
  };

  if (isLoadingActive || isLoadingModes) {
    return <AssignmentModeContentSkeleton />;
  }

  // Show error state
  if (activeError || modesError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-2">Error loading assignment modes</p>
        <p className="text-text-50 text-sm">
          {activeError?.message || modesError?.message || 'Unknown error'}
        </p>
      </div>
    );
  }

  if (!activeMode) {
    return (
      <div className="text-center py-12">
        <p className="text-text-50 mb-2">No active assignment mode found</p>
        <p className="text-xs text-text-50">
          {allModes && allModes.length > 0
            ? `Found ${allModes.length} modes, but none are marked as active`
            : 'No modes available from API'}
        </p>
      </div>
    );
  }

  if (modeOptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-50">No assignment modes available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <AssignmentModeMetrics />

      {/* Assignment Mode Selection */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-foreground mb-4">Assignment Mode</h3>
        <div className="grid grid-cols-3 gap-4">
          {modeOptions.map((mode) => (
            <AssignmentModeCard
              key={mode.id}
              id={mode.id}
              name={mode.name}
              description={mode.description}
              isActive={selectedModeType === mode.id}
              onClick={() => handleModeChange(mode.id)}
            />
          ))}
        </div>
      </Card>

      {/* Assignment Preferences */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-foreground mb-4">Assignment Preferences</h3>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <AssignmentPreferencesForm
            form={form}
            onPreferenceChange={handlePreferenceChange}
          />

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              disabled={updateMode.isPending}
              className="px-5 py-2"
            >
              {updateMode.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function AssignmentModeContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
