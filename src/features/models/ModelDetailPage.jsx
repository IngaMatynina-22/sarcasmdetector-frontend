import { Box, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useActivateModelMutation, useGetModelQuery, useGetModelsQuery } from '../../services/apiEndpoints';

export default function ModelDetailPage() {
  const { id } = useParams();
  const { data: m } = useGetModelQuery(id);
  const { data: all = [] } = useGetModelsQuery();
  const [activate] = useActivateModelMutation();
  if (!m) return 'Завантаження...';
  const metrics = m.metrics || {};
  const evalm = metrics.eval || metrics;
  return (
    <Box>
      <Typography variant="h4">{m.name}</Typography>
      <Typography>Архітектура: {m.architecture} • Версія {m.id} • Навчання: {m.trained_at}</Typography>
      <Typography>Accuracy {evalm.accuracy} Precision {evalm.precision} Recall {evalm.recall} F1 {evalm.f1}</Typography>
      <Typography>ROC-AUC {evalm.roc_auc || '—'} PR-AUC {evalm.pr_auc || '—'}</Typography>
      <pre>{JSON.stringify(evalm.confusion_matrix || metrics, null, 2)}</pre>
      <Button onClick={() => activate(m.id)}>Активувати</Button>
      <Typography variant="h6" sx={{ mt: 2 }}>Інші версії</Typography>
      {all.filter((x) => x.name === m.name).map((x) => <Typography key={x.id}>#{x.id} {x.created_at} {x.is_active && 'активна'}</Typography>)}
    </Box>
  );
}
