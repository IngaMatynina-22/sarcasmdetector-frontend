import { Box, Button, Card, CardContent, MenuItem, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import AnalysisForm from './AnalysisForm';
import AnalysisResult from './AnalysisResult';
import { useAddFeedbackMutation, useGetDatasetsQuery } from '../../services/apiEndpoints';

export default function AnalysisPage() {
  const [result, setResult] = useState(null);
  const [comment, setComment] = useState('');
  const [label, setLabel] = useState('SARCASM');
  const [ds, setDs] = useState('');
  const { data: datasets = [] } = useGetDatasetsQuery();
  const [feedback] = useAddFeedbackMutation();

  return (
    <Box>
      <PageHeader title="Аналіз заголовків" subtitle="Вставте новину й отримайте оцінку сарказму." />
      <Card>
        <CardContent>
          <AnalysisForm onResult={setResult} initialText={result?.original_text || ''} />
        </CardContent>
      </Card>
      {result && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <AnalysisResult result={result} onRerun={() => setResult(null)} />
            {result.id && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
                <TextField select fullWidth label="Правильний клас" value={label} onChange={(e) => setLabel(e.target.value)}>
                  <MenuItem value="SARCASM">Сарказм</MenuItem>
                  <MenuItem value="NOT_SARCASM">Без сарказму</MenuItem>
                  <MenuItem value="UNCERTAIN">Невизначено</MenuItem>
                </TextField>
                <TextField fullWidth label="Коментар" value={comment} onChange={(e) => setComment(e.target.value)} />
                <TextField select fullWidth label="Датасет" value={ds} onChange={(e) => setDs(e.target.value)}>
                  <MenuItem value="">Не додавати</MenuItem>
                  {datasets.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                </TextField>
                <Button variant="outlined" onClick={() => feedback({ id: result.id, corrected_label: label, comment, add_to_dataset_id: ds ? Number(ds) : null })}>
                  Відгук
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
