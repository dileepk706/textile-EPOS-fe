import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type GymState = {
  selectedGymId: string | null;
};

const initialState: GymState = {
  selectedGymId: null,
};

const gymSlice = createSlice({
  name: 'gym',
  initialState,
  reducers: {
    setSelectedGymId(state, action: PayloadAction<string | null>) {
      state.selectedGymId = action.payload;
    },
  },
});

export const { setSelectedGymId } = gymSlice.actions;

export default gymSlice.reducer;
