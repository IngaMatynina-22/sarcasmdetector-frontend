import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import PageHeader from '../../components/PageHeader';
import { useGetHistoryQuery, useGetModelsQuery, useGetStatsQuery, useHealthQuery } from '../../services/apiEndpoints';
import { labelUa, pct } from '../../utils/labels';
import { CHART } from '../../theme';

function windowCount(byDay, days) {
  const from = Date.now() - days * 86400000;
  return Object.entries(byDay || {}).reduce((acc, [d, n]) => (new Date(d).getTime() >= from ? acc + n : acc), 0);
}

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useGetStatsQuery();
  const { data: models = [] } = useGetModelsQuery();
  const { data: health } = useHealthQuery();
  const { data: recent = [] } = useGetHistoryQuery({ limit: 5, sort: 'created_at', order: 'desc' });
  const active = models.find((m) => m.is_active);

  if (isLoading) return <Typography>Завантаження...</Typography>;
  if (error) return <Typography color="error">Помилка статистики</Typography>;

  const pie = [
    { name: 'Сарказм', value: stats?.sarcasm || 0 },
    { name: 'Без сарказму', value: stats?.not_sarcasm || 0 },
    { name: 'Невизначено', value: stats?.uncertain || 0 },
  ];
  const days = Object.entries(stats?.by_day || {}).map(([d, n]) => ({ d, n }));
  const langs = Object.entries(stats?.by_language || {}).map(([k, v]) => ({ k, v }));

  return (
    <Box>
      <PageHeader
        title="Головна панель"
        action={
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="contained" component={Link} to="/analysis">Новий аналіз</Button>
            <Button variant="outlined" component={Link} to="/history">Історія</Button>
          </Stack>
        }
      />
      <Grid container spacing={2}>
        {[
          ['Аналізів', stats?.total],
          ['Саркастичних', stats?.sarcasm],
          ['Несаркастичних', stats?.not_sarcasm],
          ['Неоднозначних', stats?.uncertain],
          ['Середня ймовірність', pct(stats?.average_probability)],
          ['За 7 днів', windowCount(stats?.by_day, 7)],
          ['За 30 днів', windowCount(stats?.by_day, 30)],
          ['За 90 днів', windowCount(stats?.by_day, 90)],
        ].map(([t, v], i) => (
          <Grid key={t} size={{ xs: 6, md: 3 }}>
            <Card sx={{ bgcolor: i % 2 ? 'primary.main' : 'background.paper', color: i % 2 ? 'primary.contrastText' : 'text.primary' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>{t}</Typography>
                <Typography variant="h5">{v ?? 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Розподіл класів</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" outerRadius={80}>
                    {pie.map((_, i) => <Cell key={i} fill={CHART[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Динаміка аналізів</Typography>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <ResponsiveContainer width="100%" height={220} minWidth={280}>
                  <BarChart data={days}><XAxis dataKey="d" /><YAxis /><Tooltip /><Bar dataKey="n" fill={CHART[0]} radius={[8, 8, 0, 0]} /></BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }} useFlexGap>
        <Chip label={`Модель: ${active?.name || health?.model_version || '—'}`} />
        <Chip label={`Версія: ${active?.id || health?.model_id || '—'}`} />
        <Chip color={health?.status === 'ok' ? 'success' : 'warning'} label={`Backend: ${health?.status || 'n/a'}`} />
        <Chip color={health?.model_active ? 'success' : 'default'} label={`AI: ${health?.model_active ? 'активна' : 'немає'}`} />
      </Stack>
      <Typography variant="h6" sx={{ mt: 3 }}>Мови</Typography>
      {langs.map((l) => <Chip key={l.k} sx={{ mr: 1, mt: 1 }} label={`${l.k}: ${l.v}`} />)}
      <Typography variant="h6" sx={{ mt: 3 }}>Останні аналізи</Typography>
      <Stack spacing={1.5} sx={{ mt: 1 }}>
        {recent.map((r) => (
          <Card key={r.id} component={Link} to={`/analysis/${r.id}`} sx={{ display: 'flex', overflow: 'hidden' }}>
            <Box sx={{ width: 72, bgcolor: r.label === 'SARCASM' ? 'primary.main' : 'secondary.main', flexShrink: 0 }} />
            <CardContent sx={{ minWidth: 0 }}>
              <Typography noWrap>{r.original_text}</Typography>
              <Typography variant="body2" color="text.secondary">{labelUa(r.label)}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
