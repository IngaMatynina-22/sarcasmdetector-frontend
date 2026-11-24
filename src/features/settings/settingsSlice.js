import { createSlice } from '@reduxjs/toolkit';

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem('uiSettings') || '{}');
  } catch {
    return {};
  }
})();

const initialState = {
  theme: saved.theme || 'system',
  language: saved.language || 'uk',
  timezone: saved.timezone || 'Europe/Kyiv',
  dateFormat: saved.dateFormat || 'uk-UA',
  density: saved.density || 'comfortable',
  defaultLanguage: saved.defaultLanguage || 'auto',
  defaultModelId: saved.defaultModelId || '',
  confidenceThreshold: saved.confidenceThreshold ?? 0.5,
  extraExplanations: saved.extraExplanations ?? true,
  sentiment: saved.sentiment ?? true,
  notifyAnalysis: saved.notifyAnalysis ?? true,
  notifyBatch: saved.notifyBatch ?? true,
  notifyTraining: saved.notifyTraining ?? true,
  notifyErrors: saved.notifyErrors ?? true,
  autoSave: saved.autoSave ?? true,
  confirmBulkDelete: saved.confirmBulkDelete ?? true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
      localStorage.setItem('uiSettings', JSON.stringify(state));
    },
    updateSettings: (state, action) => {
      Object.assign(state, action.payload);
      localStorage.setItem('uiSettings', JSON.stringify(state));
    },
  },
});

export const { updateSetting, updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
