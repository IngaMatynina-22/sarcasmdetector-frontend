import { Box, Button, LinearProgress, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBatchListQuery, useBatchPreviewMutation, useBatchRunMutation, useGetModelsQuery } from '../../services/apiEndpoints';

export default function BatchAnalysisPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [column, setColumn] = useState('');
  const [error, setError] = useState('');
  const [doPreview] = useBatchPreviewMutation();
  const [run] = useBatchRunMutation();
  const { data: jobs = [] } = useBatchListQuery();
  const { data: models = [] } = useGetModelsQuery();
  const [modelId, setModelId] = useState('');
  const navigate = useNavigate();

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (!f) return;
    const ok = /\.(csv|xlsx|xls|txt|json)$/i.test(f.name);
    if (!ok) return setError('Формат: CSV, XLSX, TXT, JSON');
    if (f.size > 20 * 1024 * 1024) return setError('Файл завеликий');
    setError('');
    setFile(f);
  };

  const previewFile = async () => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await doPreview(fd).unwrap();
    setPreview(res);
    setColumn(res.suggested_column);
  };

  const start = async () => {
    await run({ jobId: preview.job_id, body: { column_name: column } }).unwrap();
    navigate(`/batch-analysis/${preview.job_id}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Пакетний аналіз</Typography>
      <Box onDragOver={(e) => e.preventDefault()} onDrop={onDrop} sx={{ p: 4, border: '2px dashed #cbd5e1', mb: 2, textAlign: 'center' }}>
        Перетягніть файл або <Button component="label">оберіть<input hidden type="file" accept=".csv,.xlsx,.xls,.txt,.json" onChange={onDrop} /></Button>
        {file && <Typography>{file.name} ({Math.round(file.size / 1024)} КБ)</Typography>}
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <Button disabled={!file} onClick={previewFile}>Попередній перегляд</Button>
      {preview && (
        <Box sx={{ mt: 2 }}>
          <Typography>Рядків: {preview.total_rows}, порожніх: {preview.empty_rows}, дублікатів: {preview.duplicates}</Typography>
          <TextField select label="Колонка заголовків" value={column} onChange={(e) => setColumn(e.target.value)} sx={{ minWidth: 200, mr: 1 }}>
            {(preview.columns || []).map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField select label="Модель" value={modelId} onChange={(e) => setModelId(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="">Активна</MenuItem>
            {models.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
          </TextField>
          <Box sx={{ my: 1 }}>{(preview.preview || []).map((p) => <Typography key={p} variant="body2">• {p}</Typography>)}</Box>
          <Button variant="contained" onClick={start}>Запустити</Button>
        </Box>
      )}
      <Typography variant="h6" sx={{ mt: 3 }}>Завдання</Typography>
      {jobs.map((j) => (
        <Box key={j.id} sx={{ py: 1 }}>
          <Link to={`/batch-analysis/${j.id}`}>{j.filename}</Link> — {j.status} ({j.processed}/{j.total_rows}, помилок {j.errors})
          {j.status === 'running' && <LinearProgress />}
        </Box>
      ))}
    </Box>
  );
}
