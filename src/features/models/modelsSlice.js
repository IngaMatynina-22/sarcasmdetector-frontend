import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const modelsSlice = createSlice({
  name: 'models',
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

export const { setItems, setLoading, setError } = modelsSlice.actions;
export const selectModels = (state) => state.models.items;
export const activateModel = (id) => ({
  type: 'models/activateModel',
  payload: id,
});
export default modelsSlice.reducer;