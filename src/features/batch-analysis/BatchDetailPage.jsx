import { Box, Button, LinearProgress, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDeleteBatchMutation, useGetBatchQuery, useGetBatchResultsQuery, useRetryBatchMutation } from '../../services/apiEndpoints';
import { downloadAuth, labelUa, pct } from '../../utils/labels';
import { useState } from 'react';

export default function BatchDetailPage() {
  const { id } = useParams();
  const token = useSelector((s) => s.auth.token);
  const { data: job, refetch } = useGetBatchQuery(id, { pollingInterval: 2000 });
  const [label, setLabel] = useState('');
  const [q, setQ] = useState('');
  const { data: rows = [] } = useGetBatchResultsQuery({ id, label: label || undefined, q: q || undefined, sort: 'sarcasm_probability' });
  const [retry] = useRetryBatchMutation();
  const [del] = useDeleteBatchMutation();
  const navigate = useNavigate();

  useEffect(() => { if (job?.status === 'done' || job?.status === 'failed') refetch(); }, [job?.status]);

  if (!job) return 'Завантаження...';
  const progress = job.total_rows ? Math.round((job.processed / job.total_rows) * 100) : 0;

  return (
    <Box>
      <Typography variant="h4">{job.filename}</Typography>
      <Typography>Створено: {job.created_at} • Статус: {job.status}</Typography>
      <Typography>Всього {job.total_rows}, оброблено {job.processed}, помилок {job.errors}</Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField size="small" label="Пошук" value={q} onChange={(e) => setQ(e.target.value)} />
        <TextField size="small" select label="Клас" value={label} onChange={(e) => setLabel(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">Усі</MenuItem>
          <MenuItem value="SARCASM">Сарказм</MenuItem>
          <MenuItem value="NOT_SARCASM">Без</MenuItem>
        </TextField>
        <Button onClick={() => retry(id)}>Повторити помилки</Button>
        <Button onClick={() => downloadAuth(`/batch/${id}/export/csv`, `batch-${id}.csv`, token)}>Завантажити</Button>
        <Button color="error" onClick={async () => { await del(id); navigate('/batch-analysis'); }}>Видалити</Button>
      </Box>
      <Table size="small">
        <TableHead><TableRow><TableCell>Текст</TableCell><TableCell>Клас</TableCell><TableCell>Ймовірність</TableCell><TableCell>Помилка</TableCell></TableRow></TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.analysis_id ? <Link to={`/analysis/${r.analysis_id}`}>{r.original_text?.slice(0, 80)}</Link> : r.original_text?.slice(0, 80)}</TableCell>
              <TableCell>{labelUa(r.label)}</TableCell>
              <TableCell>{pct(r.sarcasm_probability)}</TableCell>
              <TableCell>{r.error}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
