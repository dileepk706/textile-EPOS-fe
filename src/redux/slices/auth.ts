import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

export type AuthUserType = null | Record<string, any>;

type AuthState = {
  accessToken: string | null;
  loading: boolean;
  sessionExpired: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  loading: false,
  sessionExpired: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    login(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.loading = false;
    },
    logout(state) {
      state.accessToken = null;
      state.loading = false;
    },
    setSessionExpired(state, action: PayloadAction<boolean>) {
      state.sessionExpired = action.payload;
    },
  },
});

export const { login, logout, setLoading, setSessionExpired } = authSlice.actions;

export default authSlice.reducer;
