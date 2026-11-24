import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useGetSessionQuery, useStopSessionMutation } from '../../services/apiEndpoints';

export default function TrainingDetailPage() {
  const { id } = useParams();
  const { data: s } = useGetSessionQuery(id);
  const [stop] = useStopSessionMutation();
  if (!s) return 'Завантаження...';
  const hp = s.hyperparameters || {};
  const m = s.metrics || {};
  const chart = [{ epoch: 1, acc: m.accuracy || 0, loss: m.loss || 0 }];
  return (
    <Box>
      <Typography variant="h4">Сесія #{s.id}</Typography>
      <Typography>Модель {s.model_version_id} • датасет {s.dataset_id} • {s.status}</Typography>
      <Typography>Епохи: {hp.epochs || 1}/{hp.epochs || 1} • batch {hp.batch_size} • lr {hp.learning_rate} • {hp.optimizer}</Typography>
      <LinearProgress variant="determinate" value={s.status === 'done' ? 100 : 40} sx={{ my: 2 }} />
      <Typography>Train/Val accuracy: {m.accuracy}</Typography>
      <ResponsiveContainer width="100%" height={200}><LineChart data={chart}><XAxis dataKey="epoch" /><YAxis /><Tooltip /><Line dataKey="acc" /></LineChart></ResponsiveContainer>
      <Typography>Початок {s.created_at} • завершення {s.finished_at || '—'}</Typography>
      {s.status !== 'done' && s.status !== 'stopped' && <Button onClick={() => stop(id)}>Зупинити</Button>}
    </Box>
  );
}
