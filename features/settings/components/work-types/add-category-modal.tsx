/**
 * AddCategoryModal Component
 * 
 * Modal for adding new work type categories with color selection.
 * Uses React Hook Form and Zod for validation.
 */

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { workCategorySchema, type WorkCategoryFormData, defaultWorkCategoryValues } from '@/features/settings/validations/work-category-schemas';
import { useCreateWorkCategory } from '@/features/settings/hooks/use-work-categories';

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_COLORS = [
  { id: 'violet', name: 'Violet', hex: '#8B5CF6', class: 'bg-violet-500' },
  { id: 'blue', name: 'Blue', hex: '#3B82F6', class: 'bg-blue-500' },
  { id: 'emerald', name: 'Emerald', hex: '#10B981', class: 'bg-emerald-500' },
  { id: 'cyan', name: 'Cyan', hex: '#06B6D4', class: 'bg-cyan-500' },
  { id: 'amber', name: 'Amber', hex: '#F59E0B', class: 'bg-amber-500' },
  { id: 'teal', name: 'Teal', hex: '#14B8A6', class: 'bg-teal-500' },
  { id: 'purple', name: 'Purple', hex: '#A855F7', class: 'bg-purple-500' },
  { id: 'red', name: 'Red', hex: '#EF4444', class: 'bg-red-500' },
  { id: 'fuchsia', name: 'Fuchsia', hex: '#D946EF', class: 'bg-fuchsia-500' },
  { id: 'pink', name: 'Pink', hex: '#EC4899', class: 'bg-pink-500' },
  { id: 'orange', name: 'Orange', hex: '#F97316', class: 'bg-orange-500' },
  { id: 'lime', name: 'Lime', hex: '#84CC16', class: 'bg-lime-500' },
  { id: 'sky', name: 'Sky', hex: '#0EA5E9', class: 'bg-sky-500' },
  { id: 'slate', name: 'Slate', hex: '#64748B', class: 'bg-slate-500' },
];

export function AddCategoryModal({ open, onOpenChange }: Readonly<AddCategoryModalProps>) {
  const createWorkCategory = useCreateWorkCategory();

  const form = useForm<WorkCategoryFormData>({
    resolver: zodResolver(workCategorySchema),
    defaultValues: defaultWorkCategoryValues,
    mode: 'onBlur',
  });

  const handleSubmit = async (data: WorkCategoryFormData) => {
    try {
      await createWorkCategory.mutateAsync(data);
      form.reset();
      onOpenChange(false);
    } catch {
      // Error is handled in the mutation hook
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e293b] border border-white/10 shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-white">Add Category</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* Category Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-white/50">
                    Category Name <span className="text-rose-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Directory Compliance"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none placeholder:text-white/30"
                      disabled={createWorkCategory.isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-rose-400 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Color Selection */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-white/50 mb-3 block">
                    Color <span className="text-rose-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-7 gap-2.5">
                      {AVAILABLE_COLORS.map((color) => (
                        <label
                          key={color.id}
                          className="cursor-pointer"
                          title={color.name}
                        >
                          <input
                            type="radio"
                            name="categoryColor"
                            value={color.hex}
                            checked={field.value === color.hex}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="sr-only peer"
                            disabled={createWorkCategory.isPending}
                          />
                          <div
                            className={cn(
                              'w-10 h-10 rounded-xl transition-all',
                              color.class,
                              'peer-checked:ring-2 peer-checked:ring-white peer-checked:ring-offset-2 peer-checked:ring-offset-[#1e293b]',
                              'hover:scale-110 hover:shadow-lg',
                              createWorkCategory.isPending && 'opacity-50 cursor-not-allowed'
                            )}
                          />
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-400 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={createWorkCategory.isPending}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createWorkCategory.isPending}
                className="px-6 py-2.5 rounded-xl bg-fuchsia-600 text-white font-medium text-sm hover:bg-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-fuchsia-500/25 cursor-pointer"
              >
                {createWorkCategory.isPending ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
