import { Box, Card, CardContent, FormControlLabel, MenuItem, Slider, Stack, Switch, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import { updateSetting } from './settingsSlice';
import { useGetSettingsQuery, usePatchSettingMutation } from '../../services/apiEndpoints';
import { useAuth } from '../../hooks/useAuth';

export default function SettingsPage() {
  const s = useSelector((st) => st.settings);
  const dispatch = useDispatch();
  const set = (key, value) => dispatch(updateSetting({ key, value }));
  const { isAdmin } = useAuth();
  const { data: server } = useGetSettingsQuery();
  const [patch] = usePatchSettingMutation();

  return (
    <Box>
      <PageHeader title="Налаштування" />
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Загальні</Typography>
            <Stack spacing={2}>
              <TextField select fullWidth label="Мова інтерфейсу" value={s.language} onChange={(e) => set('language', e.target.value)}>
                <MenuItem value="uk">Українська</MenuItem><MenuItem value="en">English</MenuItem>
              </TextField>
              <TextField fullWidth label="Часовий пояс" value={s.timezone} onChange={(e) => set('timezone', e.target.value)} />
              <TextField select fullWidth label="Формат дати" value={s.dateFormat} onChange={(e) => set('dateFormat', e.target.value)}>
                <MenuItem value="uk-UA">uk-UA</MenuItem><MenuItem value="en-GB">en-GB</MenuItem>
              </TextField>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Вигляд</Typography>
            <Stack spacing={2}>
              <TextField select fullWidth label="Тема" value={s.theme} onChange={(e) => set('theme', e.target.value)}>
                <MenuItem value="light">Світла</MenuItem><MenuItem value="dark">Темна</MenuItem><MenuItem value="system">Системна</MenuItem>
              </TextField>
              <TextField select fullWidth label="Щільність" value={s.density} onChange={(e) => set('density', e.target.value)}>
                <MenuItem value="comfortable">Звичайна</MenuItem><MenuItem value="compact">Компактна</MenuItem>
              </TextField>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Аналіз</Typography>
            <TextField select fullWidth label="Мова за замовчуванням" value={s.defaultLanguage} onChange={(e) => set('defaultLanguage', e.target.value)}>
              <MenuItem value="auto">Авто</MenuItem><MenuItem value="uk">uk</MenuItem><MenuItem value="en">en</MenuItem>
            </TextField>
            <Typography sx={{ mt: 2 }}>Поріг {s.confidenceThreshold}</Typography>
            <Slider min={0.1} max={0.9} step={0.05} value={s.confidenceThreshold} onChange={(_, v) => set('confidenceThreshold', v)} />
            {isAdmin && server && (
              <TextField
                sx={{ mt: 2 }}
                fullWidth
                size="small"
                label="Серверний поріг"
                defaultValue={server.uncertain_high}
                onBlur={(e) => patch({ key: 'uncertain_high', value: e.target.value })}
              />
            )}
            <FormControlLabel control={<Switch checked={s.extraExplanations} onChange={(e) => set('extraExplanations', e.target.checked)} />} label="Пояснення" />
            <FormControlLabel control={<Switch checked={s.sentiment} onChange={(e) => set('sentiment', e.target.checked)} />} label="Тональність" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">Сповіщення</Typography>
            <FormControlLabel control={<Switch checked={s.notifyAnalysis} onChange={(e) => set('notifyAnalysis', e.target.checked)} />} label="Завершення аналізу" />
            <FormControlLabel control={<Switch checked={s.notifyBatch} onChange={(e) => set('notifyBatch', e.target.checked)} />} label="Пакетна обробка" />
            <FormControlLabel control={<Switch checked={s.notifyTraining} onChange={(e) => set('notifyTraining', e.target.checked)} />} label="Навчання" />
            <FormControlLabel control={<Switch checked={s.notifyErrors} onChange={(e) => set('notifyErrors', e.target.checked)} />} label="Помилки" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">Історія</Typography>
            <FormControlLabel control={<Switch checked={s.autoSave} onChange={(e) => set('autoSave', e.target.checked)} />} label="Зберігати результати" />
            <FormControlLabel control={<Switch checked={s.confirmBulkDelete} onChange={(e) => set('confirmBulkDelete', e.target.checked)} />} label="Підтвердження масового видалення" />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
