import { Alert, Button, Checkbox, FormControlLabel, Link, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/AuthShell';
import PasswordField from '../../components/PasswordField';
import { useRegisterMutation } from '../../services/apiEndpoints';
import { analyzePassword, passwordsMatch } from '../../utils/password';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const analysis = useMemo(() => analyzePassword(password, { email, name: fullName }), [password, email, fullName]);

  const submit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.includes('@')) return setError('Заповніть імʼя та коректний email');
    if (!analysis.ok) return setError(analysis.issues[0] || 'Пароль недостатньо надійний');
    if (!passwordsMatch(password, repeat)) return setError('Паролі не збігаються');
    if (!agree) return setError('Потрібна згода з умовами використання');
    setError('');
    try {
      await register({ email: email.trim(), password, full_name: fullName.trim() }).unwrap();
      setPassword('');
      setRepeat('');
      setOk('Обліковий запис створено. Перейдіть до входу.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err?.data?.detail || 'Помилка реєстрації');
    }
  };

  return (
    <AuthShell title="Реєстрація" subtitle="Створіть обліковий запис, щоб зберігати аналізи.">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}
      <form onSubmit={submit} autoComplete="on">
        <TextField
          fullWidth
          required
          label="Імʼя"
          name="name"
          margin="normal"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />
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
          inputProps={{ autoCapitalize: 'off', spellCheck: 'false' }}
        />
        <PasswordField
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          name="new-password"
          showStrength
          context={{ email, name: fullName }}
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
        <FormControlLabel
          control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />}
          label="Погоджуюсь з умовами використання"
        />
        <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 1 }} disabled={isLoading || !analysis.ok || !agree}>
          Створити обліковий запис
        </Button>
        <Button fullWidth variant="outlined" size="large" sx={{ mt: 1.5 }} component={RouterLink} to="/login">
          Увійти
        </Button>
      </form>
      <Typography align="center" sx={{ mt: 2 }}>
        Вже маєте акаунт? <Link component={RouterLink} to="/login">Увійти</Link>
      </Typography>
    </AuthShell>
  );
}
