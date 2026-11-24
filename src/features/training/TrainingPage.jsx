import { Box, Button, LinearProgress, MenuItem, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useGetDatasetsQuery, useGetModelsQuery, useGetSessionsQuery, useTrainModelMutation } from '../../services/apiEndpoints';

export default function TrainingPage() {
  const { data: models = [] } = useGetModelsQuery();
  const { data: datasets = [] } = useGetDatasetsQuery();
  const { data: sessions = [] } = useGetSessionsQuery();
  const [train, { isLoading }] = useTrainModelMutation();
  const [form, setForm] = useState({ dataset_id: '', name: 'sklearn-hybrid', epochs: 3, batch_size: 32, learning_rate: 0.001, optimizer: 'adam', max_features: 8000, activate: true });
  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <Box>
      <Typography variant="h4">Навчання моделей</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
        <TextField select label="Датасет" value={form.dataset_id} onChange={(e) => set('dataset_id', e.target.value)} sx={{ minWidth: 200 }}>
          {datasets.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
        </TextField>
        <TextField label="Назва" value={form.name} onChange={(e) => set('name', e.target.value)} />
        <TextField type="number" label="Епохи" value={form.epochs} onChange={(e) => set('epochs', Number(e.target.value))} />
        <TextField type="number" label="Batch" value={form.batch_size} onChange={(e) => set('batch_size', Number(e.target.value))} />
        <TextField type="number" label="LR" value={form.learning_rate} onChange={(e) => set('learning_rate', Number(e.target.value))} />
        <TextField select label="Оптимізатор" value={form.optimizer} onChange={(e) => set('optimizer', e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="adam">adam</MenuItem><MenuItem value="sgd">sgd</MenuItem>
        </TextField>
      </Box>
      <Button variant="contained" disabled={isLoading || !form.dataset_id} onClick={() => train({ ...form, dataset_id: Number(form.dataset_id) })}>Запустити</Button>
      {isLoading && <LinearProgress sx={{ mt: 2 }} />}
      <Typography variant="h6" sx={{ mt: 3 }}>Сесії</Typography>
      {sessions.map((s) => (
        <Typography key={s.id}><Link to={`/training/${s.id}`}>#{s.id}</Link> {s.status} модель {s.model_version_id}</Typography>
      ))}
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Доступні моделі</Typography>
      {models.map((m) => <Typography key={m.id}>{m.name} ({m.backend})</Typography>)}
    </Box>
  );
}
