import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessions: [],
  loading: false,
  error: null,
};

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSessions, setLoading, setError } = trainingSlice.actions;
export default trainingSlice.reducer;