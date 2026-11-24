import { Analytics, Dashboard, History, Person, Settings } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const ITEMS = [
  { to: '/dashboard', label: 'Панель', icon: <Dashboard /> },
  { to: '/analysis', label: 'Аналіз', icon: <Analytics /> },
  { to: '/history', label: 'Історія', icon: <History /> },
  { to: '/profile', label: 'Профіль', icon: <Person /> },
  { to: '/settings', label: 'Ще', icon: <Settings /> },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const value = ITEMS.find((i) => pathname === i.to || pathname.startsWith(`${i.to}/`))?.to || '';

  return (
    <Paper
      className="safe-bottom"
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 10,
        borderRadius: 6,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        zIndex: 20,
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, v) => navigate(v)}
        sx={{
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': { color: 'rgba(255,248,240,0.7)', minWidth: 56 },
          '& .Mui-selected': { color: '#FFF8F0' },
        }}
      >
        {ITEMS.map((item) => (
          <BottomNavigationAction key={item.to} value={item.to} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
