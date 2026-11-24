import { Box, Button, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useAdminLogsQuery } from '../../services/apiEndpoints';
import { downloadText } from '../../utils/labels';

export default function AdminLogsPage() {
  const [level, setLevel] = useState('');
  const [q, setQ] = useState('');
  const { data = [] } = useAdminLogsQuery({ level: level || undefined, q: q || undefined });
  return (
    <Box>
      <Typography variant="h4">Системні журнали</Typography>
      <TextField size="small" select value={level} onChange={(e) => setLevel(e.target.value)} sx={{ minWidth: 140, mr: 1 }}>
        <MenuItem value="">Усі</MenuItem>
        <MenuItem value="info">info</MenuItem>
        <MenuItem value="warning">warning</MenuItem>
        <MenuItem value="error">error</MenuItem>
      </TextField>
      <TextField size="small" label="Пошук" value={q} onChange={(e) => setQ(e.target.value)} />
      <Button onClick={() => downloadText(JSON.stringify(data, null, 2), 'logs.json')}>Експорт</Button>
      <Table size="small">
        <TableHead><TableRow><TableCell>Час</TableCell><TableCell>Тип</TableCell><TableCell>Рівень</TableCell><TableCell>Повідомлення</TableCell></TableRow></TableHead>
        <TableBody>
          {data.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.created_at}</TableCell>
              <TableCell>{r.event_type}</TableCell>
              <TableCell>{r.level}</TableCell>
              <TableCell>{r.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
