/**
 * Category Grid Component (Client)
 * 
 * Displays work type categories in a grid layout.
 * Uses TanStack Query hook to fetch category data.
 */

'use client';

import * as React from 'react';
import { AddCategoryModal } from './add-category-modal';
import { DeleteCategoryDialog } from './delete-category-dialog';
import { useWorkCategories, useDeleteWorkCategory } from '../../hooks/use-work-categories';
import type { WorkCategory } from '@/features/settings/types/work-category';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';

export function CategoryGrid() {
  const { data: categoriesResponse, isLoading } = useWorkCategories({limit: 100, page: 1});
  const categories = categoriesResponse?.data?.items || [];
  const deleteCategory = useDeleteWorkCategory();
  
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedCategory] = React.useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = React.useState<WorkCategory | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  // Get work type names for each category from API response (limit to first 3)
  const getCategoryWorkTypeNames = (category: WorkCategory) => {
    const workTypes = category.workTypes || [];
    const names = workTypes.map((wt) => wt.shortName);
    
    if (names.length === 0) return 'No work types';
    if (names.length <= 3) return names.join(', ');
    return `${names.slice(0, 3).join(', ')} +${names.length - 3}`;
  };

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleDeleteClick = (category: WorkCategory) => {
    setCategoryToDelete(category);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    } catch {
      // Error handled in mutation hook
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-xl bg-glass-bg backdrop-blur-(--glass-blur) border border-glass-border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-border-10 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-20 bg-border-10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-[24px] bg-white/3 backdrop-blur-2xl border border-white/6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-foreground">
            Work Type Categories
          </h3>
          <Button
            variant="tertiary"
            size={"sm"}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 text-sm hover:bg-violet-500/30 transition-colors cursor-pointer"
          >
            Add Category
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3">
          {categories.map((category: WorkCategory) => {
            const count = category.workTypes?.length || 0;
            const workTypeNames = getCategoryWorkTypeNames(category);
            const categoryColor = category.color || '#64748B'; // fallback to slate

            return (
              <div
                key={category.id}
                className="p-3 rounded-xl relative group transition-all"
                style={{
                  minHeight: '70px',
                  backgroundColor: hexToRgba(categoryColor, 0.1),
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: hexToRgba(categoryColor, 0.2),
                  ...(selectedCategory === category.id && {
                    boxShadow: `0 0 0 2px ${categoryColor}`,
                  }),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hexToRgba(categoryColor, 0.15);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = hexToRgba(categoryColor, 0.1);
                }}

                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="text-sm font-semibold truncate max-w-[120px]"
                    style={{ color: categoryColor }}
                  >
                    {category.name}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span 
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: hexToRgba(categoryColor, 0.2),
                        color: categoryColor,
                      }}
                    >
                      {count}
                    </span>
                    <button
                      onClick={() => {
                        handleDeleteClick(category);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded cursor-pointer"
                      aria-label="Delete category"
                    >
                      <HugeiconsIcon 
                        icon={Delete02Icon} 
                        className="w-3.5 h-3.5 text-red-400 hover:text-red-300"
                      />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-text-50 line-clamp-2">
                  {workTypeNames}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <AddCategoryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />

      <DeleteCategoryDialog
        open={showDeleteDialog}
        category={categoryToDelete}
        isDeleting={deleteCategory.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
