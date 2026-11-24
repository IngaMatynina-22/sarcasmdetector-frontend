import { Box, Typography } from '@mui/material';

const StatusBadge = ({ label, status, variant = 'outlined' }) => {
  const statusMap = {
    sarcasm: { label: 'Сарказм', color: 'error' },
    not_sarcasm: { label: 'Без сарказму', color: 'success' },
    uncertain: { label: 'Неоднозначно', color: 'warning' },
  };

  const statusInfo = statusMap[status] || { label: status, color: 'secondary' };

  return (
    <Box sx={{ px: 2, py: 1, borderRadius: 1, backgroundColor: `info.${statusInfo.color}` }}>
      <Typography variant="body2" color="contrast">
        {statusInfo.label}
      </Typography>
    </Box>
  );
};

export default StatusBadge;
export { StatusBadge };