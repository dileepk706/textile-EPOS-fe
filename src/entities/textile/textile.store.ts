import { create } from 'zustand';
import { ITextile } from './textile.type';

type TextileState = {
  textile: ITextile | null;
  setTextiles: (textile: ITextile | null) => void;
  clearTextile: () => void;
};

export const useTextilesStore = create<TextileState>()((set) => ({
  textile: null,
  setTextiles: (textile) => {
    set({ textile });
  },
  clearTextile: () => set({ textile: null }),
}));
