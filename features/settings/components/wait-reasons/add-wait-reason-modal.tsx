/**
 * Add Wait Reason Modal Component
 *
 * Modal dialog for adding or editing wait reasons.
 * Simpler form with Code, Label, Category, Pauses SLA, Auto-Chase, and Description.
 */

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const waitReasonFormSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .regex(/^[a-z0-9_]+$/, 'Code must be lowercase with underscores only'),
  name: z.string().min(1, 'Label is required'),
  description: z.string(),
  isActive: z.boolean(),
  warningDays: z.number().min(0).max(90),
  pauseSla: z.boolean(),
  criticalDays: z.number().min(0).max(90),
  category: z.enum(['external', 'internal']),
  autoChaseDays: z.number().min(0).max(90),
}).refine((data) => data.criticalDays >= data.warningDays, {
  message: 'Critical days must be greater than or equal to warning days',
  path: ['criticalDays'],
});

export type WaitReasonFormData = z.infer<typeof waitReasonFormSchema>;

interface AddWaitReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: WaitReasonFormData) => void;
  initialData?: WaitReasonFormData;
  isEdit?: boolean;
}

export function AddWaitReasonModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  isEdit = false,
}: Readonly<AddWaitReasonModalProps>) {
  const form = useForm<WaitReasonFormData>({
    resolver: zodResolver(waitReasonFormSchema),
    defaultValues: {
      code: initialData?.code ?? '',
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      isActive: initialData?.isActive ?? true,
      warningDays: initialData?.warningDays ?? 0,
      pauseSla: initialData?.pauseSla ?? true,
      criticalDays: initialData?.criticalDays ?? 0,
      category: initialData?.category ?? 'external',
      autoChaseDays: initialData?.autoChaseDays ?? 0,
    },
  });

  // Reset form when modal opens or initialData changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        code: initialData?.code ?? '',
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        isActive: initialData?.isActive ?? true,
        warningDays: initialData?.warningDays ?? 0,
        pauseSla: initialData?.pauseSla ?? true,
        criticalDays: initialData?.criticalDays ?? 0,
        category: initialData?.category ?? 'external',
        autoChaseDays: initialData?.autoChaseDays ?? 0,
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: WaitReasonFormData) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-6 w-full sm:max-w-md mx-4 gap-0 bg-[#0e1019] backdrop-blur-xl border-white/10 max-h-[85vh] flex flex-col"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center justify-between mb-6 space-y-0 shrink-0">
          <DialogTitle className="text-lg font-bold text-white">
            {isEdit ? 'Edit Wait Reason' : 'Add Wait Reason'}
          </DialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="space-y-4 overflow-y-auto overflow-x-hidden flex-1 pr-1 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Code Field */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium text-white/60">
                    Code <span className="text-rose-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., payer_response"
                      disabled={isEdit}
                      onChange={(e) => {
                        const transformedValue = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_]/g, '_');
                        field.onChange(transformedValue);
                      }}
                      className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-violet-500/50 focus-visible:ring-0 focus-visible:border-violet-500/50"
                    />
                  </FormControl>
                  <FormDescription className="text-[10px] text-white/40 mt-1">
                    Unique identifier (lowercase, underscores)
                  </FormDescription>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />

            {/* Label Field (maps to 'name' in API payload) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium text-white/60">
                    Label <span className="text-rose-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Waiting on Payer Response"
                      className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-violet-500/50 focus-visible:ring-0 focus-visible:border-violet-500/50"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium text-white/60">
                    Category <span className="text-rose-400">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-violet-500/50 focus:ring-0">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="external">
                        External (Payer, Provider, Client)
                      </SelectItem>
                      <SelectItem value="internal">
                        Internal (Team, System)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />

            {/* Is Active Field */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between py-2">
                  <div className="space-y-0">
                    <FormLabel className="text-sm text-white/80">
                      Active
                    </FormLabel>
                    <FormDescription className="text-[10px] text-white/40">
                      Enable or disable this wait reason
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-violet-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Pause SLA Field */}
            <FormField
              control={form.control}
              name="pauseSla"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between py-2">
                  <div className="space-y-0">
                    <FormLabel className="text-sm text-white/80">
                      Pause SLA
                    </FormLabel>
                    <FormDescription className="text-[10px] text-white/40">
                      Stop SLA clock while in this wait state
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-violet-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Warning Days Field */}
            <FormField
              control={form.control}
              name="warningDays"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium text-white/60">
                    Warning (days)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={90}
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        const clamped = e.target.value === '' ? 0 : Math.min(Math.max(parseInt(e.target.value, 10) || 0, 0), 90);
                        field.onChange(clamped);
                        e.currentTarget.value = String(clamped);
                      }}
                      className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-violet-500/50 focus-visible:ring-0 focus-visible:border-violet-500/50"
                    />
                  </FormControl>
                  <FormDescription className="text-[10px] text-white/40 mt-1">
                    Days until warning threshold is triggered.
                  </FormDescription>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />

            {/* Critical Days Field */}
            <FormField
              control={form.control}
              name="criticalDays"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium text-white/60">
                    Critical (days)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={90}
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        const clamped = e.target.value === '' ? 0 : Math.min(Math.max(parseInt(e.target.value, 10) || 0, 0), 90);
                        field.onChange(clamped);
                        e.currentTarget.value = String(clamped);
                      }}
                      className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-violet-500/50 focus-visible:ring-0 focus-visible:border-violet-500/50"
                    />
                  </FormControl>
                  <FormDescription className="text-[10px] text-white/40 mt-1">
                    Days until critical threshold is triggered.
                  </FormDescription>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />

            {/* Auto Chase Days Field */}
            <FormField
              control={form.control}
              name="autoChaseDays"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium text-white/60">
                    Auto Chase (days)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={90}
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        const clamped = e.target.value === '' ? 0 : Math.min(Math.max(parseInt(e.target.value, 10) || 0, 0), 90);
                        field.onChange(clamped);
                        e.currentTarget.value = String(clamped);
                      }}
                      className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-violet-500/50 focus-visible:ring-0 focus-visible:border-violet-500/50"
                    />
                  </FormControl>
                  <FormDescription className="text-[10px] text-white/40 mt-1">
                    0 = disabled. Creates follow-up task after X days.
                  </FormDescription>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium text-white/60">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="Optional notes about this wait reason..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-violet-500/50 focus-visible:ring-0 focus-visible:border-violet-500/50 resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />

            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10 shrink-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 h-auto rounded-xl bg-white/5 text-white/70 text-sm hover:bg-white/10 hover:text-white/70"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 h-auto rounded-xl bg-violet-500 text-white text-sm hover:bg-violet-600"
              >
                {isEdit ? 'Update' : 'Add'} Wait Reason
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
