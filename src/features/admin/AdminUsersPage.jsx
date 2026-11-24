import { Box, Button, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from '../../services/apiEndpoints';

export default function AdminUsersPage() {
  const { data = [] } = useGetUsersQuery();
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [patch] = useUpdateUserMutation();
  const [del] = useDeleteUserMutation();
  const rows = data.filter((u) => {
    const t = q.toLowerCase();
    if (t && !u.email.toLowerCase().includes(t) && !(u.full_name || '').toLowerCase().includes(t)) return false;
    if (role && u.role !== role) return false;
    if (status === 'active' && !u.is_active) return false;
    if (status === 'blocked' && u.is_active) return false;
    return true;
  });

  return (
    <Box>
      <Typography variant="h4">Користувачі</Typography>
      <TextField size="small" label="Пошук" value={q} onChange={(e) => setQ(e.target.value)} sx={{ mr: 1 }} />
      <TextField size="small" select value={role} onChange={(e) => setRole(e.target.value)} sx={{ minWidth: 120, mr: 1 }}><MenuItem value="">Роль</MenuItem><MenuItem value="admin">admin</MenuItem><MenuItem value="user">user</MenuItem></TextField>
      <TextField size="small" select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 140 }}><MenuItem value="">Статус</MenuItem><MenuItem value="active">активні</MenuItem><MenuItem value="blocked">заблоковані</MenuItem></TextField>
      <Table size="small">
        <TableHead><TableRow><TableCell>Імʼя</TableCell><TableCell>Email</TableCell><TableCell>Роль</TableCell><TableCell>Статус</TableCell><TableCell /></TableRow></TableHead>
        <TableBody>
          {rows.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.full_name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell><Button size="small" onClick={() => patch({ id: u.id, role: u.role === 'admin' ? 'user' : 'admin' })}>{u.role}</Button></TableCell>
              <TableCell>
                <Button size="small" onClick={() => patch({ id: u.id, is_active: !u.is_active })}>{u.is_active ? 'активний' : 'заблокований'}</Button>
              </TableCell>
              <TableCell><Button color="error" size="small" onClick={() => del(u.id)}>Видалити</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
