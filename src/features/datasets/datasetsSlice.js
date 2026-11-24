import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const datasetsSlice = createSlice({
  name: 'datasets',
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

export const { setItems, setLoading, setError } = datasetsSlice.actions;
export const selectDatasets = (state) => state.datasets.items;
export const importDataset = (data) => ({
  type: 'datasets/importDataset',
  payload: data,
});
export const deleteDataset = (id) => ({
  type: 'datasets/deleteDataset',
  payload: id,
});
export default datasetsSlice.reducer;