import { CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { pathRequiresAdmin } from '../auth/roles';
import MainLayout from '../components/layout/MainLayout';
import { logout, setUser } from '../features/auth/authSlice';
import { useMeQuery } from '../services/apiEndpoints';
import { buildTheme } from '../theme';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import AnalysisPage from '../features/analysis/AnalysisPage';
import AnalysisDetailPage from '../features/analysis/AnalysisDetailPage';
import BatchAnalysisPage from '../features/batch-analysis/BatchAnalysisPage';
import BatchDetailPage from '../features/batch-analysis/BatchDetailPage';
import HistoryPage from '../features/history/HistoryPage';
import StatisticsPage from '../features/statistics/StatisticsPage';
import DatasetsPage from '../features/datasets/DatasetsPage';
import DatasetDetailPage from '../features/datasets/DatasetDetailPage';
import ModelsPage from '../features/models/ModelsPage';
import ModelDetailPage from '../features/models/ModelDetailPage';
import TrainingPage from '../features/training/TrainingPage';
import TrainingDetailPage from '../features/training/TrainingDetailPage';
import ModelComparisonPage from '../features/models/ModelComparisonPage';
import NewsSourcesPage from '../features/newssources/NewsSourcesPage';
import NewsSourceDetailPage from '../features/newssources/NewsSourceDetailPage';
import ProfilePage from '../features/profile/ProfilePage';
import SettingsPage from '../features/settings/SettingsPage';
import AdminUsersPage from '../features/admin/AdminUsersPage';
import AdminStatsPage from '../features/admin/AdminStatsPage';
import AdminLogsPage from '../features/admin/AdminLogsPage';
import StatusPage from '../features/status/StatusPage';

function Protected({ children, admin }) {
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  const { data, error, isLoading, isFetching } = useMeQuery(undefined, { skip: !token });
  const dispatch = useDispatch();
  const needsAdmin = admin || pathRequiresAdmin(location.pathname);

  useEffect(() => {
    if (data) dispatch(setUser(data));
  }, [data, dispatch]);

  useEffect(() => {
    if (error?.status === 401 || error?.status === 403) dispatch(logout());
  }, [error, dispatch]);

  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

  if ((isLoading || isFetching) && !user?.role) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100dvh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (needsAdmin && user?.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

function PublicOnly({ children }) {
  const token = useSelector((s) => s.auth.token);
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const settings = useSelector((s) => s.settings);
  const location = useLocation();
  const mode = useMemo(() => {
    if (settings.theme === 'system') {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return settings.theme === 'dark' ? 'dark' : 'light';
  }, [settings.theme, location.pathname]);

  const theme = useMemo(() => buildTheme(mode, settings.density), [mode, settings.density]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
        <Route path="/forgot-password" element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} />
        <Route path="/reset-password" element={<PublicOnly><ResetPasswordPage /></PublicOnly>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/analysis" element={<Protected><AnalysisPage /></Protected>} />
        <Route path="/analysis/:id" element={<Protected><AnalysisDetailPage /></Protected>} />
        <Route path="/batch-analysis" element={<Protected><BatchAnalysisPage /></Protected>} />
        <Route path="/batch-analysis/:id" element={<Protected><BatchDetailPage /></Protected>} />
        <Route path="/history" element={<Protected><HistoryPage /></Protected>} />
        <Route path="/statistics" element={<Protected><StatisticsPage /></Protected>} />
        <Route path="/datasets" element={<Protected><DatasetsPage /></Protected>} />
        <Route path="/datasets/:id" element={<Protected><DatasetDetailPage /></Protected>} />
        <Route path="/models" element={<Protected><ModelsPage /></Protected>} />
        <Route path="/models/:id" element={<Protected><ModelDetailPage /></Protected>} />
        <Route path="/training" element={<Protected admin><TrainingPage /></Protected>} />
        <Route path="/training/:id" element={<Protected admin><TrainingDetailPage /></Protected>} />
        <Route path="/model-comparison" element={<Protected admin><ModelComparisonPage /></Protected>} />
        <Route path="/news-sources" element={<Protected><NewsSourcesPage /></Protected>} />
        <Route path="/news-sources/:id" element={<Protected><NewsSourceDetailPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
        <Route path="/admin/users" element={<Protected admin><AdminUsersPage /></Protected>} />
        <Route path="/admin/statistics" element={<Protected admin><AdminStatsPage /></Protected>} />
        <Route path="/admin/logs" element={<Protected admin><AdminLogsPage /></Protected>} />
        <Route path="/403" element={<StatusPage code={403} />} />
        <Route path="/500" element={<StatusPage code={500} />} />
        <Route path="/maintenance" element={<StatusPage code="maintenance" />} />
        <Route path="*" element={<StatusPage code={404} />} />
      </Routes>
    </ThemeProvider>
  );
}
