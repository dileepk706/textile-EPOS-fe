import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Supplier } from './supplier.entity';

interface PurchaseSessionState {
  selectedSupplier: Supplier | null;
  setSelectedSupplier: (supplier: Supplier | null) => void;
  clearSelectedSupplier: () => void;
}

export const usePurchaseSessionStore = create<PurchaseSessionState>()(
  persist(
    (set) => ({
      selectedSupplier: null,
      setSelectedSupplier: (supplier) => set({ selectedSupplier: supplier }),
      clearSelectedSupplier: () => set({ selectedSupplier: null }),
    }),
    {
      name: 'pos_purchase_supplier_session',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
