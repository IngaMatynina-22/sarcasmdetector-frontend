import { Box, Typography } from '@mui/material';
import BrandMark from './BrandMark';

export default function AuthShell({ title, subtitle, children, splash }) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
        bgcolor: splash ? 'primary.main' : 'background.default',
      }}
    >
      <Box
        className="auth-hero"
        sx={{
          display: { xs: splash ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: splash ? 'center' : 'flex-end',
          alignItems: splash ? 'center' : 'flex-start',
          p: { xs: 4, md: 8 },
          minHeight: { xs: '36dvh', md: 'auto' },
          background: splash
            ? 'linear-gradient(180deg, #C9A48A 0%, #A87455 40%, #7A4A32 100%)'
            : 'radial-gradient(circle at 20% 20%, #E2C9B0 0%, transparent 45%), radial-gradient(circle at 80% 80%, #C9A48A 0%, transparent 40%), linear-gradient(180deg, #7A4A32 0%, #4A2C1A 100%)',
          color: '#FFF8F0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: 28, left: 32, fontWeight: 700, letterSpacing: 0.4, display: { xs: 'none', md: 'block' } }}>
          Soul · SD
        </Box>
        <BrandMark color="#FFF8F0" size={splash ? 88 : 72} slogan="аналіз сарказму в заголовках" />
        <Typography sx={{ maxWidth: 420, opacity: 0.88, mt: 2, display: { xs: 'none', md: 'block' } }}>
          Спокійно, точно, з поясненням моделі — у теплій кавовій палітрі.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          placeItems: { xs: 'start center', md: 'center' },
          p: { xs: 3, sm: 5 },
          pt: { xs: splash ? 2 : 6, md: 5 },
          bgcolor: 'background.paper',
          borderTopLeftRadius: { xs: 32, md: 0 },
          borderTopRightRadius: { xs: 32, md: 0 },
          mt: { xs: splash ? -3 : 0, md: 0 },
          position: 'relative',
          minHeight: { xs: '64dvh', md: '100dvh' },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2 }}>
            SarcasmDetector AI
          </Typography>
          <Typography variant="h4" sx={{ mb: 1 }}>{title}</Typography>
          {subtitle && <Typography color="text.secondary" sx={{ mb: 3 }}>{subtitle}</Typography>}
          {children}
        </Box>
      </Box>
    </Box>
  );
}
