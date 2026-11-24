import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useActivateModelMutation, useGetModelsQuery } from '../../services/apiEndpoints';

export default function ModelsPage() {
  const { data = [] } = useGetModelsQuery();
  const [q, setQ] = useState('');
  const [arch, setArch] = useState('');
  const [activate] = useActivateModelMutation();
  const rows = data.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()) && (!arch || m.backend === arch));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>AI-моделі</Typography>
      <TextField size="small" label="Пошук" value={q} onChange={(e) => setQ(e.target.value)} sx={{ mr: 1 }} />
      <TextField size="small" label="Архітектура" value={arch} onChange={(e) => setArch(e.target.value)} />
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {rows.map((m) => (
          <Grid key={m.id} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6"><Link to={`/models/${m.id}`}>{m.name}</Link> {m.is_active && '(активна)'}</Typography>
                <Typography>{m.architecture} • v{m.id}</Typography>
                <Typography>Accuracy: {m.accuracy ?? '—'}</Typography>
                <Typography variant="caption">{m.created_at}</Typography>
                <Box><Button size="small" onClick={() => activate(m.id)}>Обрати для аналізу</Button></Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
