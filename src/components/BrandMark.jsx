import { Box, Typography } from '@mui/material';

export default function BrandMark({ color = '#4A2C1A', size = 72, title = 'SarcasmDetector', slogan }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        component="svg"
        viewBox="0 0 64 64"
        sx={{ width: size, height: size, display: 'block', mx: 'auto', mb: 1.5 }}
        aria-hidden
      >
        <path
          fill={color}
          d="M14 22h30a4 4 0 0 1 4 4v10a16 16 0 0 1-16 16H26A16 16 0 0 1 10 36V26a4 4 0 0 1 4-4zm34 8h4a8 8 0 0 1 0 16h-3.2A19.9 19.9 0 0 0 50 36V30zM22 10c0 4 4 6 4 10h4c0-4-4-6-4-10h-4zm10 0c0 4 4 6 4 10h4c0-4-4-6-4-10h-4z"
        />
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: size > 56 ? 22 : 18, color, letterSpacing: 0.2 }}>
        {title}
      </Typography>
      {slogan && (
        <Typography variant="body2" sx={{ color, opacity: 0.7, mt: 0.5 }}>
          {slogan}
        </Typography>
      )}
    </Box>
  );
}
