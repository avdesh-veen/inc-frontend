/**
 * Capacity Settings Form Component (Client)
 * 
 * Configure analyst capacity thresholds and workload forecasting.
 * Uses React Hook Form + Zod validation for settings management.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
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
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCapacitySettings,
  useUpdateCapacitySettings,
} from '@/features/settings/hooks/use-assignment';
import {
  capacitySettingsSchema,
  type CapacitySettingsFormData,
} from '@/features/settings/validations/assignment-schemas';

export function CapacitySettingsForm() {
  const { data: capacitySettings, isLoading, error } = useCapacitySettings();
  const updateSettings = useUpdateCapacitySettings();

  const form = useForm<CapacitySettingsFormData>({
    resolver: zodResolver(capacitySettingsSchema),
    values: capacitySettings
      ? {
          maxTasksAllowed: Number(capacitySettings.maxTasksAllowed),
          maxActiveTasksPerAnalyst: Number(capacitySettings.maxActiveTasksPerAnalyst),
          warningThresholdPercent: Number(capacitySettings.warningThresholdPercent),
          enableForecastingAlerts: Boolean(capacitySettings.enableForecastingAlerts),
          forecastHorizonDays: Number(capacitySettings.forecastHorizonDays),
        }
      : undefined,
  });

  const onSubmit = (data: CapacitySettingsFormData) => {
    
    if (!capacitySettings?.id) {
      console.error('Capacity settings ID not found', capacitySettings);
      return;
    }
    
    const payload = {
      id: capacitySettings.id,
      data,
    };
    
    
    updateSettings.mutate(payload);
  };

  const handleSubmit = form.handleSubmit(
    onSubmit,
    (errors) => {
      console.error('Form validation errors:', errors);
    }
  );

  if (isLoading) {
    return <CapacitySettingsFormSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-2">Error loading capacity settings</p>
        <p className="text-text-50 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!capacitySettings) {
    return (
      <div className="text-center py-12">
        <p className="text-text-50">No capacity settings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <div className="flex items-start gap-3">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="w-5 h-5 text-cyan-400 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-medium text-cyan-300">Capacity Management</p>
            <p className="text-xs text-text-70 mt-1">
              Configure workload limits and forecasting to prevent analyst overload and optimize
              task distribution.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Capacity Thresholds */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-foreground mb-4">Capacity Thresholds</h3>
            <p className="text-xs text-text-50 mb-4">
              Define workload limits for automatic assignment. New tasks won&apos;t auto-assign to
              analysts over capacity.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {/* Maximum Active Tasks Per Analyst */}
              <FormField
                control={form.control}
                name="maxActiveTasksPerAnalyst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-text-50">
                      Max Active Tasks Per Analyst
                    </FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Slider
                          min={1}
                          max={30}
                          step={1}
                          value={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                          className="flex-1"
                        />
                      </FormControl>
                      <span className="px-3 py-1.5 rounded-lg bg-border-10 text-foreground font-medium text-sm min-w-[50px] text-center">
                        {field.value}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-text-50 mt-1.5">
                        1 task
                      </p>
                      <p className="text-xs text-text-50 mt-1.5">
                        30 tasks
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Warning Threshold */}
              <FormField
                control={form.control}
                name="warningThresholdPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-text-50">
                      Warning Threshold (%)
                    </FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Slider
                          min={50}
                          max={100}
                          step={5}
                          value={[Number(field.value)]}
                          onValueChange={(values) => field.onChange(Number(values[0]))}
                          className="flex-1"
                        />
                      </FormControl>
                      <span className="px-3 py-1.5 rounded-lg bg-border-10 text-foreground font-medium text-sm min-w-[50px] text-center">
                        {field.value}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-text-50 mt-1.5">
                        50%
                      </p>
                      <p className="text-xs text-text-50 mt-1.5">
                        100%
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Workload Forecasting */}
            <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
        <h3 className="text-base font-bold text-foreground mb-4">Workload Forecasting</h3>

        {/* Info Banner */}
        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 mb-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-cyan-300">Predictive Capacity Alerts</p>
              <p className="text-xs text-text-70 mt-1">
                The system will analyze historical patterns to forecast workload and alert when predicted capacity
                exceeds thresholds. This feature captures data for future ML optimization.
              </p>
            </div>
          </div>
        </div>

        {/* Forecasting Settings */}
        <div className="grid grid-cols-2 gap-4">
          {/* Enable forecasting alerts */}
          <FormField
                control={form.control}
                name="enableForecastingAlerts"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 rounded-xl bg-glass-bg border border-border-5">
                    <div className="flex-1">
                      <FormLabel className="text-sm text-foreground font-normal">
                        Enable Forecasting Alerts
                      </FormLabel>
                      <p className="text-xs text-text-50 mt-0.5">
                        Predict upcoming capacity issues
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        className="cursor-pointer"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

          {/* Forecast horizon */}
          <FormField
            control={form.control}
            name="forecastHorizonDays"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex-1">
                  <FormLabel className="text-sm text-foreground font-normal">
                    Forecast Horizon
                  </FormLabel>
                  <p className="text-xs text-text-50 mt-0.5">
                    How far ahead to predict issues
                  </p>
                </div>
                <Select
                  value={field.value.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger className="w-32 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm cursor-pointer">
                      <SelectValue placeholder="Select horizon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateSettings.isPending}
              className="px-5 py-2"
            >
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function CapacitySettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}
