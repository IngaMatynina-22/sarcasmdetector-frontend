import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  result: null,
  loading: false,
  error: null,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setResult: (state, action) => {
      state.result = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearResult: (state) => {
      state.result = null;
    },
  },
});

export const { setResult, setLoading, setError, clearResult } = analysisSlice.actions;
export default analysisSlice.reducer;