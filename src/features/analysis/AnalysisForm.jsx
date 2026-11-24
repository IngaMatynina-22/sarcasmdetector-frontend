import { Box, Button, FormControlLabel, MenuItem, Slider, Stack, Switch, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAnalyzeMutation, useGetModelsQuery } from '../../services/apiEndpoints';

export default function AnalysisForm({ onResult, initialText = '' }) {
  const settings = useSelector((s) => s.settings);
  const [text, setText] = useState(initialText);
  const [language, setLanguage] = useState(settings.defaultLanguage || 'auto');
  const [modelId, setModelId] = useState(settings.defaultModelId || '');
  const [threshold, setThreshold] = useState(settings.confidenceThreshold ?? 0.5);
  const [sentiment, setSentiment] = useState(settings.sentiment);
  const [explain, setExplain] = useState(settings.extraExplanations);
  const [error, setError] = useState('');
  const { data: models = [] } = useGetModelsQuery();
  const [analyze, { isLoading }] = useAnalyzeMutation();

  const paste = async () => {
    const t = await navigator.clipboard.readText();
    setText(t);
  };

  const submit = async () => {
    if (!text.trim()) return setError('Введіть заголовок');
    if (text.length > 2000) return setError('Занадто довгий заголовок');
    setError('');
    const res = await analyze({
      text: text.trim(),
      save: settings.autoSave,
      language: language === 'auto' ? null : language,
      model_id: modelId ? Number(modelId) : null,
      include_sentiment: sentiment,
      include_explanation: explain,
      confidence_threshold: threshold,
    }).unwrap();
    onResult?.(res);
  };

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        minRows={3}
        label="Заголовок новини"
        value={text}
        onChange={(e) => setText(e.target.value)}
        helperText={`${text.length} / 2000`}
        error={!!error}
      />
      {error && <Typography color="error" variant="caption">{error}</Typography>}
      <Stack direction="row" spacing={1} sx={{ my: 1 }} flexWrap="wrap" useFlexGap>
        <Button onClick={paste}>Вставити</Button>
        <Button onClick={() => { setText(''); onResult?.(null); }}>Очистити</Button>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField select fullWidth label="Мова" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <MenuItem value="auto">Авто</MenuItem>
          <MenuItem value="uk">Українська</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </TextField>
        <TextField select fullWidth label="Модель" value={modelId} onChange={(e) => setModelId(e.target.value)}>
          <MenuItem value="">Активна</MenuItem>
          {models.map((m) => <MenuItem key={m.id} value={m.id}>{m.name} ({m.backend})</MenuItem>)}
        </TextField>
      </Stack>
      <Typography sx={{ mt: 2 }}>Поріг впевненості: {threshold}</Typography>
      <Slider min={0.1} max={0.9} step={0.05} value={threshold} onChange={(_, v) => setThreshold(v)} />
      <FormControlLabel control={<Switch checked={sentiment} onChange={(e) => setSentiment(e.target.checked)} />} label="Аналіз тональності" />
      <FormControlLabel control={<Switch checked={explain} onChange={(e) => setExplain(e.target.checked)} />} label="Лінгвістичне пояснення" />
      <Button variant="contained" fullWidth sx={{ mt: 2 }} disabled={isLoading} onClick={submit}>
        {isLoading ? 'Аналіз...' : 'Запустити аналіз'}
      </Button>
    </Box>
  );
}
