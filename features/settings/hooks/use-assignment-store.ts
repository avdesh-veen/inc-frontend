/**
 * Assignment Module Zustand Store
 * 
 * Manages UI state for the assignment module including:
 * - Active tab state
 * - Modal states (routing rule form, delete confirmation)
 * - Selected items for editing
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { RoutingRule } from '@/features/settings/types/assignment';

interface AssignmentStore {
  // Modal states
  isRoutingRuleFormOpen: boolean;
  isDeleteRuleModalOpen: boolean;

  // Selected items
  selectedRule: RoutingRule | null;

  // Actions
  openRoutingRuleForm: (rule?: RoutingRule) => void;
  closeRoutingRuleForm: () => void;
  openDeleteRuleModal: (rule: RoutingRule) => void;
  closeDeleteRuleModal: () => void;
}

export const useAssignmentStore = create<AssignmentStore>()(
  devtools(
    (set) => ({
      // Initial state
      isRoutingRuleFormOpen: false,
      isDeleteRuleModalOpen: false,
      selectedRule: null,

      // Actions
      openRoutingRuleForm: (rule) =>
        set({
          isRoutingRuleFormOpen: true,
          selectedRule: rule || null,
        }),

      closeRoutingRuleForm: () =>
        set({
          isRoutingRuleFormOpen: false,
          selectedRule: null,
        }),

      openDeleteRuleModal: (rule) =>
        set({
          isDeleteRuleModalOpen: true,
          selectedRule: rule,
        }),

      closeDeleteRuleModal: () =>
        set({
          isDeleteRuleModalOpen: false,
          selectedRule: null,
        }),
    }),
    { name: 'assignment-store' }
  )
);
