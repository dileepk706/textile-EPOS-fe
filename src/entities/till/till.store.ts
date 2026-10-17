import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Till } from './till.entity';

interface ActiveTillState {
  activeTillId: string | null;
  activeTill: Till | null;
  setActiveTill: (till: Till | null) => void;
  clearActiveTill: () => void;
  updateCashInTill: (newAmount: number) => void;
}

export const useActiveTillStore = create<ActiveTillState>()(
  persist(
    (set) => ({
      activeTillId: null,
      activeTill: null,
      setActiveTill: (till) =>
        set({
          activeTill: till,
          activeTillId: till ? till.id : null,
        }),
      clearActiveTill: () =>
        set({
          activeTill: null,
          activeTillId: null,
        }),
      updateCashInTill: (newAmount) =>
        set((state) => ({
          activeTill: state.activeTill ? { ...state.activeTill, cash_in_till: newAmount } : null,
        })),
    }),
    {
      name: 'pos_active_till_session',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
