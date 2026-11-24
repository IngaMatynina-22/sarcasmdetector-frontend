import { Box, Typography, Button } from '@mui/material';
import { StatusBadge } from './StatusBadge';

const PredictionBadge = ({ probability, onExplain }) => {
  const label = probability > 0.6 ? 'Сарказм' : probability < 0.4 ? 'Без сарказму' : 'Неоднозначно';

  return (
    <Box sx={{ p: 1, borderRadius: 1 }}>
      <StatusBadge status={probability > 0.6 ? 'sarcasm' : probability < 0.4 ? 'not_sarcasm' : 'uncertain'} />
      <Typography variant="body2" sx={{ ml: 1 }}>
        {probability.toFixed(2)}%
      </Typography>
      <Button size="small" onClick={onExplain} sx={{ ml: 1, fontSize: '0.7rem' }}>
        Пояснення
      </Button>
    </Box>
  );
};

export default PredictionBadge;