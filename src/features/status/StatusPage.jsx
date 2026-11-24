import { ThumbUpAlt } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const copy = {
  403: { title: '403', text: 'Недостатньо прав доступу' },
  404: { title: '404', text: 'Сторінку не знайдено' },
  500: { title: '500', text: 'Внутрішня помилка сервера' },
  maintenance: { title: 'Обслуговування', text: 'Триває технічне обслуговування' },
};

export default function StatusPage({ code }) {
  const item = copy[code] || copy[404];
  return (
    <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', p: 4, bgcolor: 'background.default' }}>
      <Box textAlign="center" sx={{ maxWidth: 420 }}>
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'grid',
            placeItems: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <ThumbUpAlt sx={{ fontSize: 44 }} />
        </Box>
        <Typography variant="h2">{item.title}</Typography>
        <Typography sx={{ my: 2 }} color="text.secondary">{item.text}</Typography>
        <Button component={Link} to="/dashboard" variant="contained" size="large">На головну</Button>
      </Box>
    </Box>
  );
}
