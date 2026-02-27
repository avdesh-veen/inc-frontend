/**
 * Client Store
 * 
 * Zustand store for managing client UI state only.
 * ONLY handles modal state - NO data, filtering, or sorting logic.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Client store state interface (UI state only)
 */
interface ClientStore {
  // Modal state ONLY (UI state)
  isFormModalOpen: boolean;
  editingClientId: string | null;
  
  // Modal actions
  openFormModal: (editId?: string) => void;
  closeFormModal: () => void;
}

/**
 * Create client store with devtools for debugging
 */
export const useClientStore = create<ClientStore>()(
  devtools(
    (set) => ({
      // Initial state
      isFormModalOpen: false,
      editingClientId: null,
      
      // Actions
      openFormModal: (editId) =>
        set({
          isFormModalOpen: true,
          editingClientId: editId || null,
        }),
      
      closeFormModal: () =>
        set({
          isFormModalOpen: false,
          editingClientId: null,
        }),
    }),
    { name: 'ClientStore' }
  )
);
