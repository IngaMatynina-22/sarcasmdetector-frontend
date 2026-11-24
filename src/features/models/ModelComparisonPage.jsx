import { Box, Button, Checkbox, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCompareEvalMutation, useGetDatasetsQuery, useGetModelsQuery } from '../../services/apiEndpoints';
import { downloadText } from '../../utils/labels';

export default function ModelComparisonPage() {
  const { data: models = [] } = useGetModelsQuery();
  const { data: datasets = [] } = useGetDatasetsQuery();
  const [ids, setIds] = useState([]);
  const [ds, setDs] = useState('');
  const [compare, { data }] = useCompareEvalMutation();
  const toggle = (id) => setIds(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  const chart = (data?.results || []).filter((r) => !r.error).map((r) => ({ name: r.name, f1: r.f1, accuracy: r.accuracy, precision: r.precision, recall: r.recall }));

  return (
    <Box>
      <Typography variant="h4">Порівняння моделей</Typography>
      {models.map((m) => <FormControlLabel key={m.id} control={<Checkbox checked={ids.includes(m.id)} onChange={() => toggle(m.id)} />} label={m.name} />)}
      <TextField select label="Тестовий датасет" value={ds} onChange={(e) => setDs(e.target.value)} sx={{ minWidth: 220, mx: 2 }}>
        {datasets.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
      </TextField>
      <Button variant="contained" onClick={() => compare({ dataset_id: Number(ds), model_ids: ids, split: 'test' })}>Оцінити</Button>
      {chart.length > 0 && (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chart}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="f1" fill="#2563EB" /><Bar dataKey="accuracy" fill="#22c55e" /></BarChart>
        </ResponsiveContainer>
      )}
      {data?.best_model_id && <Typography sx={{ mt: 2 }}>Найкраща за F1: #{data.best_model_id}</Typography>}
      <Button sx={{ mt: 1 }} onClick={() => downloadText(JSON.stringify(data, null, 2), 'compare.json')}>Експорт</Button>
    </Box>
  );
}
