/**
 * Assignment Preferences Form Component (Client)
 * 
 * Form section for assignment preferences with switches.
 */

'use client';

import { UseFormReturn } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import type { AssignmentModeFormData } from '@/features/settings/validations/assignment-schemas';

type AssignmentPreferencesFormProps = {
  form: UseFormReturn<AssignmentModeFormData>;
  onPreferenceChange: (
    key: keyof Omit<AssignmentModeFormData, 'type'>,
    value: boolean
  ) => void;
};

export function AssignmentPreferencesForm({
  form,
  onPreferenceChange,
}: Readonly<AssignmentPreferencesFormProps>) {
  const preferences = [
    {
      key: 'considerAnalystAvailability' as const,
      label: 'Consider analyst availability (leave calendar)',
    },
    {
      key: 'preferRecentTaskAnalyst' as const,
      label: 'Prefer analysts with related recent tasks',
    },
    {
      key: 'autoReassignOnAbsence' as const,
      label: 'Auto-reassign on analyst absence',
    },
    {
      key: 'clientAffinityEnabled' as const,
      label: 'Enable client affinity (prefer same analyst for repeat work)',
    },
  ];

  return (
    <>
      {preferences.map(({ key, label }) => (
        <div
          key={key}
          className="flex items-center justify-between p-3 rounded-xl bg-glass-bg border border-border-5"
        >
          <span className="text-sm text-foreground">{label}</span>
          <Switch
           className="cursor-pointer"
            checked={form.watch(key) ?? false}
            onCheckedChange={(checked) => onPreferenceChange(key, checked)}
          />
        </div>
      ))}
    </>
  );
}
