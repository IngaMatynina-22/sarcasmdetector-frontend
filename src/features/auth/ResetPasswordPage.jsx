import { Alert, Button, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../../components/AuthShell';
import PasswordField from '../../components/PasswordField';
import { useResetPasswordMutation } from '../../services/apiEndpoints';
import { analyzePassword, passwordsMatch } from '../../utils/password';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get('token') || '');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [reset, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const analysis = useMemo(() => analyzePassword(password), [password]);

  const submit = async (e) => {
    e.preventDefault();
    if (!analysis.ok) return setError(analysis.issues[0] || 'Пароль недостатньо надійний');
    if (!passwordsMatch(password, repeat)) return setError('Паролі не збігаються');
    if (!token.trim()) return setError('Немає токена скидання');
    setError('');
    try {
      await reset({ token: token.trim(), new_password: password }).unwrap();
      setPassword('');
      setRepeat('');
      setOk('Пароль змінено. Можна увійти.');
      setTimeout(() => navigate('/login'), 1200);
    } catch {
      setError('Недійсний або прострочений токен');
    }
  };

  return (
    <AuthShell title="Скидання пароля" subtitle="Придумайте новий надійний пароль.">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}
      <form onSubmit={submit} autoComplete="off">
        <TextField
          fullWidth
          label="Токен"
          name="reset-token"
          margin="normal"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoComplete="off"
          inputProps={{ spellCheck: 'false' }}
        />
        <PasswordField
          label="Новий пароль"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          name="new-password"
          showStrength
        />
        <PasswordField
          label="Повторіть пароль"
          value={repeat}
          onChange={setRepeat}
          autoComplete="new-password"
          name="new-password-confirm"
          error={Boolean(repeat) && !passwordsMatch(password, repeat)}
          helperText={repeat && !passwordsMatch(password, repeat) ? 'Паролі не збігаються' : ' '}
        />
        <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading || !analysis.ok}>
          Підтвердити зміну
        </Button>
      </form>
    </AuthShell>
  );
}
