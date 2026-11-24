import { Box, Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useGetStatsQuery } from '../../services/apiEndpoints';
import { downloadText, pct } from '../../utils/labels';
import { CHART } from '../../theme';
import PageHeader from '../../components/PageHeader';
import { useSelector } from 'react-redux';

export default function StatisticsPage() {
  const { data: stats } = useGetStatsQuery();
  const token = useSelector((s) => s.auth.token);
  if (!stats) return 'Завантаження...';
  const pie = [
    { name: 'Сарказм', value: stats.sarcasm },
    { name: 'Без', value: stats.not_sarcasm },
    { name: 'Невизн.', value: stats.uncertain },
  ];
  const days = Object.entries(stats.by_day || {}).map(([d, n]) => ({ d, n }));
  const langs = Object.entries(stats.by_language || {}).map(([k, v]) => ({ k, v }));
  const sources = Object.entries(stats.by_source || {}).map(([k, v]) => ({ k, v }));

  const exportStats = () => downloadText(JSON.stringify(stats, null, 2), 'statistics.json', 'application/json');

  return (
    <Box>
      <PageHeader title="Статистика та аналітика" />
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button onClick={exportStats}>Експорт JSON</Button>
        <Button onClick={() => downloadText(JSON.stringify(stats, null, 2), 'statistics-report.pdf')}>PDF-звіт</Button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}><Card><CardContent><Typography>Всього</Typography><Typography variant="h5">{stats.total}</Typography></CardContent></Card></Grid>
        <Grid size={{ xs: 12, md: 3 }}><Card><CardContent><Typography>Сарказм</Typography><Typography variant="h5">{pct(stats.ratios?.SARCASM)}</Typography></CardContent></Card></Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card><CardContent>
            <Typography>Класи</Typography>
            <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={pie} dataKey="value" nameKey="name">{pie.map((_, i) => <Cell key={i} fill={CHART[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card><CardContent>
            <Typography>Динаміка</Typography>
            <ResponsiveContainer width="100%" height={240}><BarChart data={days}><XAxis dataKey="d" /><YAxis /><Tooltip /><Bar dataKey="n" fill={CHART[0]} radius={[8,8,0,0]} /></BarChart></ResponsiveContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
      <Typography variant="h6" sx={{ mt: 2 }}>Мови</Typography>
      {langs.map((l) => <Typography key={l.k}>{l.k}: {l.v}</Typography>)}
      <Typography variant="h6" sx={{ mt: 2 }}>Джерела</Typography>
      {sources.map((l) => <Typography key={l.k}>{l.k}: {l.v}</Typography>)}
      <Typography variant="h6" sx={{ mt: 2 }}>Маркери</Typography>
      {(stats.top_markers || []).map((m) => <Typography key={m.name + m.value}>{m.name} / {m.value}: {m.count}</Typography>)}
    </Box>
  );
}
