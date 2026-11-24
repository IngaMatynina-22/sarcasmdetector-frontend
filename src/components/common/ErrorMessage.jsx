import { Box, Button, Icon } from '@mui/material';
import { Link } from 'react-router-dom';

const ErrorMessage = ({ message, retry, path }) => {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Icon>error</Icon>
      <Typography variant="h5" gutterBottom>
        Сталася помилка
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
      {retry && (
        <Button variant="contained" onClick={retry}>
          Спробувати знову
        </Button>
      )}
      {path && (
        <Link to={path} sx={{ mt: 2 }}>
          Повернути на головну
        </Link>
      )}
    </Box>
  );
};

export default ErrorMessage;