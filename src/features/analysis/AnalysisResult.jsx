import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { copyText, downloadText, labelUa, pct } from '../../utils/labels';

function highlight(text, features = []) {
  const tokens = (features.find((f) => f.name === 'tokens')?.value || '').split(',').map((t) => t.trim()).filter(Boolean);
  if (!tokens.length) return text;
  let out = text;
  tokens.slice(0, 12).forEach((t) => {
    if (t.length > 2) out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
  });
  return out;
}

export default function AnalysisResult({ result, onRerun }) {
  const navigate = useNavigate();
  if (!result) return null;
  const feats = result.linguistic_features || [];
  const markers = result.features?.markers || {};
  const payload = JSON.stringify(result, null, 2);

  return (
    <Box sx={{ mt: 3 }}>
      <Alert severity={result.label === 'SARCASM' ? 'error' : result.label === 'NOT_SARCASM' ? 'success' : 'warning'}>
        {labelUa(result.label)} — ймовірність сарказму {pct(result.sarcasm_probability)}
      </Alert>
      <Typography sx={{ mt: 2 }} dangerouslySetInnerHTML={{ __html: highlight(result.original_text, feats) }} />
      <Stack direction="row" spacing={1} sx={{ my: 1, flexWrap: 'wrap' }}>
        <Chip label={`Без сарказму: ${pct(1 - (result.sarcasm_probability || 0))}`} />
        <Chip label={`Впевненість: ${pct(result.confidence)}`} />
        <Chip label={`Мова: ${result.language}`} />
        <Chip label={`Час: ${result.processing_ms ?? '—'} мс`} />
        <Chip label={`Модель: ${result.model_name || result.model_version_id || '—'}`} />
      </Stack>
      {result.explanation && <Typography sx={{ mt: 2 }}>{result.explanation}</Typography>}
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Ознаки</Typography>
      {feats.map((f) => <Chip key={f.name + f.value} sx={{ m: 0.5 }} label={`${f.name}: ${f.value}`} />)}
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Маркери</Typography>
      {Object.entries(markers).map(([k, v]) => <Chip key={k} sx={{ m: 0.5 }} label={`${k}: ${Array.isArray(v) ? v.join(', ') : v}`} />)}
      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
        <Button onClick={() => copyText(payload)}>Копіювати</Button>
        <Button onClick={() => downloadText(payload, `analysis-${result.id || 'new'}.json`, 'application/json')}>JSON</Button>
        <Button onClick={() => downloadText(result.original_text + '\n' + result.explanation, `analysis-${result.id || 'new'}.txt`)}>TXT</Button>
        <Button onClick={() => downloadText(payload, `analysis-${result.id || 'new'}.pdf`)}>PDF</Button>
        <Button onClick={onRerun}>Повторний аналіз</Button>
        {result.id && <Button onClick={() => navigate(`/analysis/${result.id}`)}>Деталі</Button>}
      </Stack>
    </Box>
  );
}
