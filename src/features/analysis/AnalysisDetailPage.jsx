import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import AnalysisResult from './AnalysisResult';
import { useAddFeedbackMutation, useDeleteAnalysisMutation, useGetAnalysisQuery, useReanalyzeMutation } from '../../services/apiEndpoints';
import { downloadText } from '../../utils/labels';

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetAnalysisQuery(id);
  const [reanalyze] = useReanalyzeMutation();
  const [del] = useDeleteAnalysisMutation();
  const [feedback] = useAddFeedbackMutation();
  const [label, setLabel] = useState('SARCASM');
  const navigate = useNavigate();

  if (isLoading) return 'Завантаження...';
  if (error) return 'Не знайдено';

  return (
    <Box>
      <PageHeader back title={`Детальний результат #${id}`} />
      <Typography color="text.secondary">{data.created_at}</Typography>
      <AnalysisResult
        result={data}
        onRerun={async () => {
          const r = await reanalyze(id).unwrap();
          navigate(`/analysis/${r.id}`);
        }}
      />
      <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
        <TextField select value={label} onChange={(e) => setLabel(e.target.value)}><MenuItem value="SARCASM">Сарказм</MenuItem><MenuItem value="NOT_SARCASM">Без</MenuItem></TextField>
        <Button onClick={() => feedback({ id, corrected_label: label, comment: '' })}>Відгук</Button>
        <Button onClick={() => downloadText(JSON.stringify(data, null, 2), `analysis-${id}.json`)}>Експорт</Button>
        <Button color="error" onClick={async () => { await del(id); navigate('/history'); }}>Видалити</Button>
      </Box>
    </Box>
  );
}
