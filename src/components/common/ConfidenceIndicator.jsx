import { Box, Typography, LinearProgress } from '@mui/material';

const ConfidenceIndicator = ({ probability }) => {
  const confidence = Math.abs(probability - 0.5) * 2;
  const percentage = Math.min(confidence * 100, 100);
  const isSarcasm = probability > 0.5;

  return (
    <Box sx={{ width: '100%', height: 8, borderRadius: 4, bgcolor: 'background.paper' }}>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{ borderRadius: 4, height: '100%' }}
        style={{ backgroundColor: isSarcasm ? 'error.main' : 'success.main' }}
      />
      <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
        {percentage.toFixed(0)}% впевненості
      </Typography>
    </Box>
  );
};

export default ConfidenceIndicator;