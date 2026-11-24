import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token || localStorage.getItem('token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Me', 'History', 'Stats', 'Batch', 'Datasets', 'Models', 'Training', 'Sources', 'Users', 'Logs', 'Settings'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: new URLSearchParams({ username: credentials.username, password: credentials.password }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    }),
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    me: builder.query({ query: () => '/auth/me', providesTags: ['Me'] }),
    logout: builder.mutation({ query: () => ({ url: '/auth/logout', method: 'POST' }) }),
    updateMe: builder.mutation({
      query: (body) => ({ url: '/auth/me', method: 'PATCH', body }),
      invalidatesTags: ['Me'],
    }),
    changePassword: builder.mutation({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', body }),
    }),
    deleteMe: builder.mutation({ query: () => ({ url: '/auth/me', method: 'DELETE' }) }),
    forgotPassword: builder.mutation({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),
    health: builder.query({ query: () => '/health' }),
    analyze: builder.mutation({
      query: (body) => ({ url: '/analyze', method: 'POST', body }),
      invalidatesTags: ['History', 'Stats'],
    }),
    getHistory: builder.query({
      query: (params) => ({ url: '/history', params }),
      providesTags: ['History'],
    }),
    getAnalysis: builder.query({
      query: (id) => `/history/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'History', id }],
    }),
    reanalyze: builder.mutation({
      query: (id) => ({ url: `/history/${id}/reanalyze`, method: 'POST' }),
      invalidatesTags: ['History', 'Stats'],
    }),
    deleteAnalysis: builder.mutation({
      query: (id) => ({ url: `/history/${id}`, method: 'DELETE' }),
      invalidatesTags: ['History', 'Stats'],
    }),
    deleteHistory: builder.mutation({
      query: (ids) => ({ url: '/history', method: 'DELETE', params: ids?.length ? { ids: ids.join(',') } : {} }),
      invalidatesTags: ['History', 'Stats'],
    }),
    addFeedback: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/history/${id}/feedback`, method: 'POST', body }),
    }),
    exportHistory: builder.query({
      query: (fmt) => ({ url: `/history/export-file/${fmt}`, responseHandler: (r) => r.blob() }),
    }),
    batchPreview: builder.mutation({
      query: (formData) => ({ url: '/batch/preview', method: 'POST', body: formData }),
    }),
    batchList: builder.query({ query: () => '/batch', providesTags: ['Batch'] }),
    batchRun: builder.mutation({
      query: ({ jobId, body }) => ({ url: `/batch/${jobId}/run`, method: 'POST', body }),
      invalidatesTags: ['Batch'],
    }),
    getBatch: builder.query({
      query: (id) => `/batch/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Batch', id }],
    }),
    getBatchResults: builder.query({
      query: ({ id, ...params }) => ({ url: `/batch/${id}/results`, params }),
    }),
    retryBatch: builder.mutation({
      query: (id) => ({ url: `/batch/${id}/retry-failed`, method: 'POST' }),
      invalidatesTags: ['Batch'],
    }),
    deleteBatch: builder.mutation({
      query: (id) => ({ url: `/batch/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Batch'],
    }),
    getStats: builder.query({ query: () => '/stats', providesTags: ['Stats'] }),
    getDatasets: builder.query({ query: () => '/datasets', providesTags: ['Datasets'] }),
    getDataset: builder.query({
      query: (id) => `/datasets/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Datasets', id }],
    }),
    createDataset: builder.mutation({
      query: (body) => ({ url: '/datasets', method: 'POST', body }),
      invalidatesTags: ['Datasets'],
    }),
    updateDataset: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/datasets/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Datasets'],
    }),
    deleteDataset: builder.mutation({
      query: (id) => ({ url: `/datasets/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Datasets'],
    }),
    getSamples: builder.query({
      query: (id) => `/datasets/${id}/samples`,
      providesTags: (_r, _e, id) => [{ type: 'Datasets', id: `s${id}` }],
    }),
    addSample: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/datasets/${id}/samples`, method: 'POST', body }),
      invalidatesTags: ['Datasets'],
    }),
    updateSample: builder.mutation({
      query: ({ datasetId, sampleId, ...body }) => ({
        url: `/datasets/${datasetId}/samples/${sampleId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Datasets'],
    }),
    deleteSample: builder.mutation({
      query: ({ datasetId, sampleId }) => ({
        url: `/datasets/${datasetId}/samples/${sampleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Datasets'],
    }),
    importDataset: builder.mutation({
      query: ({ id, formData }) => ({ url: `/datasets/${id}/import`, method: 'POST', body: formData }),
      invalidatesTags: ['Datasets'],
    }),
    getModels: builder.query({ query: () => '/models', providesTags: ['Models'] }),
    getModel: builder.query({ query: (id) => `/models/${id}` }),
    activateModel: builder.mutation({
      query: (id) => ({ url: `/models/${id}/activate`, method: 'POST' }),
      invalidatesTags: ['Models'],
    }),
    trainModel: builder.mutation({
      query: (body) => ({ url: '/models/train', method: 'POST', body }),
      invalidatesTags: ['Models', 'Training'],
    }),
    evaluateModel: builder.mutation({
      query: (body) => ({ url: '/models/evaluate', method: 'POST', body }),
    }),
    compareModels: builder.mutation({
      query: (body) => ({ url: '/models/compare', method: 'POST', body }),
    }),
    compareEval: builder.mutation({
      query: (body) => ({ url: '/models/compare-eval', method: 'POST', body }),
    }),
    getSessions: builder.query({ query: () => '/models/training-sessions', providesTags: ['Training'] }),
    getSession: builder.query({ query: (id) => `/models/training-sessions/${id}` }),
    stopSession: builder.mutation({
      query: (id) => ({ url: `/models/training-sessions/${id}/stop`, method: 'POST' }),
      invalidatesTags: ['Training'],
    }),
    getSources: builder.query({ query: () => '/ingest/sources', providesTags: ['Sources'] }),
    getSource: builder.query({ query: (id) => `/ingest/sources/${id}` }),
    createSource: builder.mutation({
      query: (body) => ({ url: '/ingest/sources', method: 'POST', body }),
      invalidatesTags: ['Sources'],
    }),
    updateSource: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/ingest/sources/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Sources'],
    }),
    deleteSource: builder.mutation({
      query: (id) => ({ url: `/ingest/sources/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Sources'],
    }),
    checkSource: builder.mutation({
      query: (id) => ({ url: `/ingest/sources/${id}/check`, method: 'POST' }),
      invalidatesTags: ['Sources'],
    }),
    syncSource: builder.mutation({
      query: (id) => ({ url: `/ingest/sources/${id}/sync`, method: 'POST' }),
      invalidatesTags: ['Sources', 'History'],
    }),
    getSourceHeadlines: builder.query({ query: (id) => `/ingest/sources/${id}/headlines` }),
    getSettings: builder.query({ query: () => '/settings', providesTags: ['Settings'] }),
    patchSetting: builder.mutation({
      query: ({ key, value }) => ({ url: `/settings/${key}`, method: 'PATCH', body: { value } }),
      invalidatesTags: ['Settings'],
    }),
    getUsers: builder.query({ query: () => '/auth/users', providesTags: ['Users'] }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/auth/users/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/auth/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
    adminStats: builder.query({ query: () => '/admin/stats' }),
    adminLogs: builder.query({ query: (params) => ({ url: '/admin/logs', params }), providesTags: ['Logs'] }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useLogoutMutation,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useDeleteMeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useHealthQuery,
  useAnalyzeMutation,
  useGetHistoryQuery,
  useGetAnalysisQuery,
  useReanalyzeMutation,
  useDeleteAnalysisMutation,
  useDeleteHistoryMutation,
  useAddFeedbackMutation,
  useLazyExportHistoryQuery,
  useBatchPreviewMutation,
  useBatchListQuery,
  useBatchRunMutation,
  useGetBatchQuery,
  useGetBatchResultsQuery,
  useRetryBatchMutation,
  useDeleteBatchMutation,
  useGetStatsQuery,
  useGetDatasetsQuery,
  useGetDatasetQuery,
  useCreateDatasetMutation,
  useUpdateDatasetMutation,
  useDeleteDatasetMutation,
  useGetSamplesQuery,
  useAddSampleMutation,
  useUpdateSampleMutation,
  useDeleteSampleMutation,
  useImportDatasetMutation,
  useGetModelsQuery,
  useGetModelQuery,
  useActivateModelMutation,
  useTrainModelMutation,
  useEvaluateModelMutation,
  useCompareModelsMutation,
  useCompareEvalMutation,
  useGetSessionsQuery,
  useGetSessionQuery,
  useStopSessionMutation,
  useGetSourcesQuery,
  useGetSourceQuery,
  useCreateSourceMutation,
  useUpdateSourceMutation,
  useDeleteSourceMutation,
  useCheckSourceMutation,
  useSyncSourceMutation,
  useGetSourceHeadlinesQuery,
  useGetSettingsQuery,
  usePatchSettingMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAdminStatsQuery,
  useAdminLogsQuery,
} = api;

export const API_BASE_URL = API_BASE;
export const authApi = api;
export const analysisApi = api;
export const batchApi = api;
export const historyApi = api;
export const statisticsApi = api;
export const datasetsApi = api;
export const modelsApi = api;
export const trainingApi = api;
export const newsSourcesApi = api;
