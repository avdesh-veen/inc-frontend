/**
 * Provider Store
 * 
 * Zustand store for managing provider UI state ONLY.
 * Does NOT store search, filters, sort, or data state - those are managed by URL params.
 * Only stores: form submission state and other transient UI state.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Provider store state interface
 * UI state only - NO data, search, filter, or sort storage
 */
interface ProviderState {
  // Form submission state
  isSubmitting: boolean;
  
  // Actions
  setIsSubmitting: (submitting: boolean) => void;
}

/**
 * Initial state
 */
const initialState = {
  isSubmitting: false,
};

/**
 * Create provider store with devtools for debugging
 */
export const useProviderStore = create<ProviderState>()(
  devtools(
    (set) => ({
      ...initialState,

      /**
       * Set submitting state for forms
       */
      setIsSubmitting: (isSubmitting) =>
        set({ isSubmitting }, false, 'setIsSubmitting'),
    }),
    { name: 'ProviderStore' }
  )
);
