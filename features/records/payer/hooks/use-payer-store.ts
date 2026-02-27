import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PayerStore {
  isPayerModalOpen: boolean;
  isContactModalOpen: boolean;
  editingPayerId: string | null;

  openPayerModal: (editId?: string) => void;
  closePayerModal: () => void;
  openContactModal: () => void;
  closeContactModal: () => void;
}

export const usePayerStore = create<PayerStore>()(
  devtools(
    (set) => ({
      isPayerModalOpen: false,
      isContactModalOpen: false,
      editingPayerId: null,

      openPayerModal: (editId) =>
        set({ isPayerModalOpen: true, editingPayerId: editId ?? null }),
      closePayerModal: () =>
        set({ isPayerModalOpen: false, editingPayerId: null }),
      openContactModal: () => set({ isContactModalOpen: true }),
      closeContactModal: () => set({ isContactModalOpen: false }),
    }),
    { name: "PayerStore" },
  ),
);
