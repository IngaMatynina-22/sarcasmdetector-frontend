import { Alert, Button, Link, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AuthShell from '../../components/AuthShell';
import { useForgotPasswordMutation } from '../../services/apiEndpoints';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [send, { isLoading }] = useForgotPasswordMutation();

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) return setError('Введіть коректний email');
    setError('');
    try {
      const res = await send({ email: email.trim() }).unwrap();
      setMsg(res.detail || 'Якщо акаунт існує, інструкції надіслано.');
    } catch {
      setError('Не вдалося надіслати запит');
    }
  };

  return (
    <AuthShell title="Відновлення пароля" subtitle="Надішлемо посилання, якщо обліковий запис існує.">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
      <form onSubmit={submit}>
        <TextField
          fullWidth
          required
          type="email"
          label="Email"
          name="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2 }} disabled={isLoading}>
          Надіслати інструкції
        </Button>
      </form>
      <Typography sx={{ mt: 2 }}>
        <Link component={RouterLink} to="/login">Назад до входу</Link>
      </Typography>
    </AuthShell>
  );
}
