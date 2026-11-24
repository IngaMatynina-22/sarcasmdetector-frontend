import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetSourceHeadlinesQuery, useGetSourceQuery, useSyncSourceMutation } from '../../services/apiEndpoints';
import { labelUa } from '../../utils/labels';

export default function NewsSourceDetailPage() {
  const { id } = useParams();
  const { data: s } = useGetSourceQuery(id);
  const { data: rows = [] } = useGetSourceHeadlinesQuery(id);
  const [sync] = useSyncSourceMutation();
  const [q, setQ] = useState('');
  const [label, setLabel] = useState('');
  if (!s) return 'Завантаження...';
  const filtered = rows.filter((r) => (!q || r.original_text.toLowerCase().includes(q.toLowerCase())) && (!label || r.label === label));
  return (
    <Box>
      <Typography variant="h4">{s.name}</Typography>
      <Typography>URL: {s.url} • RSS: {s.rss_url} • {s.status}</Typography>
      <Typography>Остання синхронізація: {s.last_synced_at || '—'} • новин {s.headline_count}</Typography>
      <Button onClick={() => sync(id)}>Синхронізувати</Button>
      <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
        <TextField size="small" label="Пошук" value={q} onChange={(e) => setQ(e.target.value)} />
        <TextField size="small" select value={label} onChange={(e) => setLabel(e.target.value)} sx={{ minWidth: 140 }}><MenuItem value="">Усі</MenuItem><MenuItem value="SARCASM">Сарказм</MenuItem><MenuItem value="NOT_SARCASM">Без</MenuItem></TextField>
      </Box>
      {filtered.map((r) => (
        <Typography key={r.id}><Link to={`/analysis/${r.id}`}>{r.original_text}</Link> — {labelUa(r.label)} — {r.created_at}</Typography>
      ))}
    </Box>
  );
}
