import { CircularProgress, Box } from '@mui/material';

const Loader = ({ size = 40, color = 'primary', className }) => {
  return (
    <Box sx={{ width: size, height: size }}>
      <CircularProgress size={size} color={className} />
    </Box>
  );
};

export default Loader;