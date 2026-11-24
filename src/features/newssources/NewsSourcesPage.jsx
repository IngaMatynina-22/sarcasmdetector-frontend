import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCheckSourceMutation, useCreateSourceMutation, useDeleteSourceMutation, useGetSourcesQuery, useSyncSourceMutation } from '../../services/apiEndpoints';

export default function NewsSourcesPage() {
  const { data = [] } = useGetSourcesQuery();
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [form, setForm] = useState({ name: '', url: '', rss_url: '', source_type: 'rss' });
  const [create] = useCreateSourceMutation();
  const [del] = useDeleteSourceMutation();
  const [sync] = useSyncSourceMutation();
  const [check] = useCheckSourceMutation();
  const rows = data.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) && (!type || s.source_type === type));

  return (
    <Box>
      <Typography variant="h4">Новинні джерела</Typography>
      <Box sx={{ display: 'flex', gap: 1, my: 2, flexWrap: 'wrap' }}>
        <TextField size="small" label="Пошук" value={q} onChange={(e) => setQ(e.target.value)} />
        <TextField size="small" select label="Тип" value={type} onChange={(e) => setType(e.target.value)} sx={{ minWidth: 120 }}><MenuItem value="">Усі</MenuItem><MenuItem value="rss">RSS</MenuItem><MenuItem value="site">Сайт</MenuItem></TextField>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <TextField size="small" label="Назва" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextField size="small" label="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <TextField size="small" label="RSS" value={form.rss_url} onChange={(e) => setForm({ ...form, rss_url: e.target.value })} />
        <Button onClick={() => create(form)}>Додати</Button>
      </Box>
      {rows.map((s) => (
        <Box key={s.id} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
          <Link to={`/news-sources/${s.id}`}>{s.name}</Link> — {s.status} — заголовків {s.headline_count} — остання синхр. {s.last_synced_at || '—'}
          <Button size="small" onClick={() => check(s.id)}>Перевірити</Button>
          <Button size="small" onClick={() => sync(s.id)}>Синхронізувати</Button>
          <Button size="small" color="error" onClick={() => del(s.id)}>Видалити</Button>
        </Box>
      ))}
    </Box>
  );
}
