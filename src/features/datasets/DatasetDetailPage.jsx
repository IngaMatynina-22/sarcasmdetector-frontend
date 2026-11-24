import { Box, Button, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useAddSampleMutation, useDeleteSampleMutation, useGetDatasetQuery, useGetSamplesQuery,
  useImportDatasetMutation, useUpdateDatasetMutation, useUpdateSampleMutation,
} from '../../services/apiEndpoints';
import { downloadText, labelUa } from '../../utils/labels';

export default function DatasetDetailPage() {
  const { id } = useParams();
  const { data: ds } = useGetDatasetQuery(id);
  const { data: samples = [] } = useGetSamplesQuery(id);
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('');
  const [text, setText] = useState('');
  const [label, setLabel] = useState('SARCASM');
  const [add] = useAddSampleMutation();
  const [upd] = useUpdateSampleMutation();
  const [del] = useDeleteSampleMutation();
  const [imp] = useImportDatasetMutation();
  const [patch] = useUpdateDatasetMutation();

  const rows = useMemo(() => samples.filter((s) => {
    if (q && !s.text.toLowerCase().includes(q.toLowerCase())) return false;
    if (cls && s.label !== cls) return false;
    return true;
  }), [samples, q, cls]);
  const dups = samples.filter((s, i) => samples.findIndex((x) => x.text === s.text) !== i);

  if (!ds) return 'Завантаження...';
  return (
    <Box>
      <Typography variant="h4">{ds.name}</Typography>
      <Typography>{ds.description} • баланс {ds.sarcasm_count}/{ds.not_sarcasm_count}</Typography>
      <Button onClick={() => patch({ id, description: prompt('Опис', ds.description) || ds.description })}>Редагувати</Button>
      <Button component="label">Імпорт<input hidden type="file" onChange={(e) => { const fd = new FormData(); fd.append('file', e.target.files[0]); imp({ id, formData: fd }); }} /></Button>
      <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
        <TextField size="small" label="Пошук" value={q} onChange={(e) => setQ(e.target.value)} />
        <TextField size="small" select value={cls} onChange={(e) => setCls(e.target.value)} sx={{ minWidth: 140 }}><MenuItem value="">Усі</MenuItem><MenuItem value="SARCASM">Сарказм</MenuItem><MenuItem value="NOT_SARCASM">Без</MenuItem></TextField>
        <TextField size="small" label="Новий заголовок" value={text} onChange={(e) => setText(e.target.value)} />
        <TextField size="small" select value={label} onChange={(e) => setLabel(e.target.value)}><MenuItem value="SARCASM">Сарказм</MenuItem><MenuItem value="NOT_SARCASM">Без</MenuItem></TextField>
        <Button onClick={() => add({ id, text, label })}>Додати</Button>
        <Button onClick={() => downloadText(JSON.stringify(rows, null, 2), 'samples.json')}>Експорт вибраних</Button>
      </Box>
      {!!dups.length && <Typography color="warning.main">Дублікатів: {dups.length}</Typography>}
      <Table size="small">
        <TableHead><TableRow><TableCell>Текст</TableCell><TableCell>Мітка</TableCell><TableCell>Мова</TableCell><TableCell /></TableRow></TableHead>
        <TableBody>
          {rows.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.text}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => upd({ datasetId: id, sampleId: s.id, label: s.label === 'SARCASM' ? 'NOT_SARCASM' : 'SARCASM' })}>{labelUa(s.label)}</Button>
              </TableCell>
              <TableCell>{s.language}</TableCell>
              <TableCell><Button color="error" size="small" onClick={() => del({ datasetId: id, sampleId: s.id })}>Видалити</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
