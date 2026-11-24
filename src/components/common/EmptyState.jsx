import { Box, Icon, Typography } from '@mui/material';

const EmptyState = ({ icon, title, description, buttonText, onClick }) => {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Icon>{icon}</Icon>
      <Typography variant="h5" sx={{ mt: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {description}
      </Typography>
      {buttonText && (
        <Button onClick={onClick} sx={{ mt: 2 }} component="a">
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;