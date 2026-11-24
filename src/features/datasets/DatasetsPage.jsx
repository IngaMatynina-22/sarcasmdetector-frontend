import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreateDatasetMutation, useDeleteDatasetMutation, useGetDatasetsQuery } from '../../services/apiEndpoints';
import { downloadText } from '../../utils/labels';

export default function DatasetsPage() {
  const { data = [] } = useGetDatasetsQuery();
  const [q, setQ] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [create] = useCreateDatasetMutation();
  const [del] = useDeleteDatasetMutation();
  const rows = data.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Датасети</Typography>
      <TextField size="small" label="Пошук" value={q} onChange={(e) => setQ(e.target.value)} sx={{ mr: 2 }} />
      <TextField size="small" label="Назва" value={name} onChange={(e) => setName(e.target.value)} sx={{ mr: 1 }} />
      <TextField size="small" label="Опис" value={desc} onChange={(e) => setDesc(e.target.value)} sx={{ mr: 1 }} />
      <Button onClick={() => create({ name, description: desc })}>Створити</Button>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {rows.map((d) => (
          <Grid key={d.id} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6"><Link to={`/datasets/${d.id}`}>{d.name}</Link></Typography>
                <Typography>{d.description}</Typography>
                <Typography>Записів: {d.sample_count} • Сарказм: {d.sarcasm_count} • Без: {d.not_sarcasm_count}</Typography>
                <Typography variant="caption">{d.created_at}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Button size="small" onClick={() => downloadText(JSON.stringify(d), `${d.name}.json`)}>Експорт</Button>
                  <Button size="small" color="error" onClick={() => del(d.id)}>Видалити</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
