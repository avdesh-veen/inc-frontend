/**
 * DeleteCategoryDialog Component
 * 
 * Reusable confirmation dialog for deleting work categories.
 * Displays a warning modal with category details and confirmation actions.
 */

'use client';

import * as React from 'react';
import type { WorkCategory } from '@/features/settings/types/work-category';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteCategoryDialogProps {
  open: boolean;
  category: WorkCategory | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteCategoryDialog({
  open,
  category,
  isDeleting,
  onConfirm,
  onCancel,
}: Readonly<DeleteCategoryDialogProps>) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Work Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">{category?.name}</span>?
            {category?.workTypes && category.workTypes.length > 0 && (
              <span className="block mt-2 text-amber-500">
                Warning: This category has {category.workTypes.length} associated work type(s).
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Category'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
