import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SalesCartItem {
  id: string; // unique item key: e.g. `${productId}_${batchId}`
  batch_id: string;
  batch_number: string;
  product_id: string;
  product_name: string;
  product_code: string;
  unit?: string;
  quantity: number;
  unit_price: number; // selling price per unit
  cost_price?: number;
  tax_rate: number;
  discount: number;
  serial_numbers: string[];
  available_batch_quantity: number;
  available_serials?: string[];
}

interface SalesCartState {
  items: SalesCartItem[];
  addItem: (item: SalesCartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, updates: Partial<SalesCartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  subtotalAmount: () => number;
}

export const useSalesCartStore = create<SalesCartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            // Update quantity capped at available_batch_quantity
            const newQty = Math.min(
              existing.quantity + item.quantity,
              item.available_batch_quantity || Infinity
            );
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: newQty,
                      unit_price: item.unit_price,
                      serial_numbers: Array.from(
                        new Set([...i.serial_numbers, ...item.serial_numbers])
                      ).slice(0, newQty),
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) => {
              if (i.id !== id) return i;
              const validQty = Math.min(quantity, i.available_batch_quantity || quantity);
              return {
                ...i,
                quantity: validQty,
                serial_numbers: i.serial_numbers.slice(0, validQty),
              };
            }),
          };
        }),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      totalQuantity: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      subtotalAmount: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const lineTotal = item.unit_price * item.quantity - (item.discount || 0);
          return sum + Math.max(0, lineTotal);
        }, 0);
      },
    }),
    {
      name: 'pos_sales_cart',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
