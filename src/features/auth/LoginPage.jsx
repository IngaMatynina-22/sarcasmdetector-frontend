import { Alert, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/AuthShell';
import PasswordField from '../../components/PasswordField';
import { useLoginMutation } from '../../services/apiEndpoints';
import { loginSuccess } from './authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || !password) {
      setError('Введіть коректний email і пароль');
      return;
    }
    setError('');
    try {
      const res = await login({ username: email.trim(), password }).unwrap();
      setPassword('');
      dispatch(loginSuccess({ token: res.access_token, user: null }));
      navigate('/dashboard');
    } catch {
      setError('Невірний email або пароль');
    }
  };

  return (
    <AuthShell splash title="Вхід" subtitle="Продовжіть аналіз заголовків з того місця, де зупинилися.">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={submit} autoComplete="on">
        <TextField
          fullWidth
          required
          type="email"
          label="Email"
          name="username"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          inputProps={{ autoCapitalize: 'off', autoCorrect: 'off', spellCheck: 'false' }}
        />
        <PasswordField
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          name="password"
        />
        <Stack spacing={1.5} sx={{ mt: 3 }}>
          <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading}>
            {isLoading ? 'Вхід...' : 'Увійти'}
          </Button>
          <Button fullWidth variant="outlined" size="large" component={RouterLink} to="/register">
            Реєстрація
          </Button>
        </Stack>
      </form>
      <Typography align="center" sx={{ mt: 2 }}>
        <Link component={RouterLink} to="/forgot-password">Забули пароль?</Link>
      </Typography>
    </AuthShell>
  );
}
