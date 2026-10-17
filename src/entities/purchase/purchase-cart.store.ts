import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PurchaseCartItem {
  product_id: string;
  product_name: string;
  product_code: string;
  unit?: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  mrp: number;
  serial_numbers: string[];
}

interface PurchaseCartState {
  supplierId: string | null;
  supplierName: string | null;
  items: PurchaseCartItem[];
  setSupplier: (id: string, name: string) => void;
  addItem: (item: PurchaseCartItem) => void;
  updateItem: (product_id: string, updates: Partial<PurchaseCartItem>) => void;
  removeItem: (product_id: string) => void;
  clearCart: () => void;
  totalAmount: () => number;
}

export const usePurchaseCartStore = create<PurchaseCartState>()(
  persist(
    (set, get) => ({
      supplierId: null,
      supplierName: null,
      items: [],

      setSupplier: (id, name) => set({ supplierId: id, supplierName: name }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id);
          if (existing) {
            // Replace existing item with updated data
            return {
              items: state.items.map((i) => (i.product_id === item.product_id ? item : i)),
            };
          }
          return { items: [...state.items, item] };
        }),

      updateItem: (product_id, updates) =>
        set((state) => ({
          items: state.items.map((i) => (i.product_id === product_id ? { ...i, ...updates } : i)),
        })),

      removeItem: (product_id) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== product_id),
        })),

      clearCart: () => set({ supplierId: null, supplierName: null, items: [] }),

      totalAmount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.cost_price * item.quantity, 0);
      },
    }),
    {
      name: 'pos_purchase_cart',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
