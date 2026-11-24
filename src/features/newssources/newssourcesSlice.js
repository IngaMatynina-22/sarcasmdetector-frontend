import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const newssourcesSlice = createSlice({
  name: 'newssources',
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

export const { setItems, setLoading, setError } = newssourcesSlice.actions;
export const selectNewsSources = (state) => state.newssources.items;
export const syncSource = (id) => ({
  type: 'newssources/syncSource',
  payload: id,
});
export default newssourcesSlice.reducer;