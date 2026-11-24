import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useAdminStatsQuery, useGetStatsQuery, useHealthQuery } from '../../services/apiEndpoints';

export default function AdminStatsPage() {
  const { data } = useAdminStatsQuery();
  const { data: stats } = useGetStatsQuery();
  const { data: health } = useHealthQuery();
  if (!data) return 'Завантаження...';
  const items = [
    ['Користувачі', data.users_total],
    ['Активні', data.users_active],
    ['Аналізи', data.analyses],
    ['Пакетні завдання', data.batch_jobs],
    ['Навчальні сесії', data.training_sessions],
    ['Backend', health?.status],
    ['Модель', health?.model_version],
    ['Середня ймовірність', stats?.average_probability],
  ];
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Системна статистика</Typography>
      <Grid container spacing={2}>
        {items.map(([t, v]) => (
          <Grid key={t} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card><CardContent><Typography color="text.secondary">{t}</Typography><Typography variant="h5">{String(v ?? '—')}</Typography></CardContent></Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
