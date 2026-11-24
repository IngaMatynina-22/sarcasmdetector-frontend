import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  overview: null,
  loading: false,
  error: null,
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    setOverview: (state, action) => {
      state.overview = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setOverview, setLoading, setError } = statisticsSlice.actions;
export const selectStatistics = (state) => state.statistics;
export default statisticsSlice.reducer;