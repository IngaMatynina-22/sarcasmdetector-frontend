import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import BottomNav from './BottomNav';
import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER = 268;

export default function MainLayout({ children }) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);

  const drawer = <Sidebar onNavigate={() => setOpen(false)} />;

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
      {desktop ? (
        <Box
          sx={{
            width: DRAWER,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          {drawer}
        </Box>
      ) : (
        <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: DRAWER, bgcolor: 'background.paper' } }}>
          {drawer}
        </Drawer>
      )}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header onMenu={() => setOpen(true)} />
        <Box
          component="main"
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            flexGrow: 1,
            pb: { xs: 12, md: 4 },
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
          }}
        >
          {children}
        </Box>
        {!desktop && <BottomNav />}
      </Box>
    </Box>
  );
}
