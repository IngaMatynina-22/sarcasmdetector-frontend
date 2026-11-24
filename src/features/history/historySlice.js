import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setItems, setLoading, setError } = historySlice.actions;
export const selectHistory = (state) => state.history.items;
export const deleteAnalysis = (id) => ({
  type: 'history/deleteAnalysis',
  payload: id,
});
export default historySlice.reducer;