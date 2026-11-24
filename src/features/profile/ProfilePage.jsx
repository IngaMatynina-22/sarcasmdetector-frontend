import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import PasswordField from '../../components/PasswordField';
import { logout } from '../auth/authSlice';
import { useChangePasswordMutation, useDeleteMeMutation, useGetHistoryQuery, useUpdateMeMutation } from '../../services/apiEndpoints';
import { analyzePassword, passwordsMatch } from '../../utils/password';

export default function ProfilePage() {
  const user = useSelector((s) => s.auth.user);
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [oldP, setOldP] = useState('');
  const [newP, setNewP] = useState('');
  const [repeat, setRepeat] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [patch] = useUpdateMeMutation();
  const [change] = useChangePasswordMutation();
  const [del] = useDeleteMeMutation();
  const { data: history = [] } = useGetHistoryQuery({ limit: 200 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const analysis = useMemo(() => analyzePassword(newP, { email, name }), [newP, email, name]);

  useEffect(() => {
    setName(user?.full_name || '');
    setEmail(user?.email || '');
  }, [user]);

  const saveProfile = async () => {
    setError('');
    try {
      await patch({ full_name: name.trim(), email: email.trim() }).unwrap();
      setMsg('Профіль збережено');
    } catch {
      setError('Не вдалося зберегти профіль');
    }
  };

  const savePassword = async () => {
    setError('');
    if (!oldP) return setError('Вкажіть поточний пароль');
    if (!analysis.ok) return setError(analysis.issues[0] || 'Новий пароль недостатньо надійний');
    if (!passwordsMatch(newP, repeat)) return setError('Паролі не збігаються');
    if (oldP === newP) return setError('Новий пароль має відрізнятися від поточного');
    try {
      await change({ old_password: oldP, new_password: newP }).unwrap();
      setOldP('');
      setNewP('');
      setRepeat('');
      setMsg('Пароль змінено');
    } catch {
      setError('Не вдалося змінити пароль');
    }
  };

  return (
    <Box>
      <PageHeader title="Профіль" subtitle={`Роль: ${user?.role || '—'} • аналізів: ${history.length}`} />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Особисті дані</Typography>
            <TextField fullWidth label="Імʼя" value={name} onChange={(e) => setName(e.target.value)} margin="normal" autoComplete="name" />
            <TextField fullWidth type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" autoComplete="username" />
            <Button variant="contained" sx={{ mt: 1 }} onClick={saveProfile}>Зберегти</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Зміна пароля</Typography>
            <PasswordField label="Поточний пароль" value={oldP} onChange={setOldP} autoComplete="current-password" name="current-password" />
            <PasswordField label="Новий пароль" value={newP} onChange={setNewP} autoComplete="new-password" name="new-password" showStrength context={{ email, name }} />
            <PasswordField
              label="Повторіть новий пароль"
              value={repeat}
              onChange={setRepeat}
              autoComplete="new-password"
              name="new-password-confirm"
              error={Boolean(repeat) && !passwordsMatch(newP, repeat)}
              helperText={repeat && !passwordsMatch(newP, repeat) ? 'Паролі не збігаються' : ' '}
            />
            <Button variant="contained" onClick={savePassword} disabled={!analysis.ok || !oldP}>Змінити пароль</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" color="error">Небезпечна зона</Typography>
            <Button
              color="error"
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={async () => {
                if (!window.confirm('Видалити обліковий запис?')) return;
                await del();
                dispatch(logout());
                navigate('/register');
              }}
            >
              Видалити обліковий запис
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
