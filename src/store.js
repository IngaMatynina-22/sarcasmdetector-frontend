import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import settingsReducer from './features/settings/settingsSlice';
import { api } from './services/apiEndpoints';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export default store;
