import {
  Analytics,
  CompareArrows,
  Dashboard,
  Dataset,
  History,
  LibraryBooks,
  ModelTraining,
  Newspaper,
  People,
  Person,
  Settings,
  Shield,
  Storage,
} from '@mui/icons-material';
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { visibleAdminNav, visibleNav } from '../../auth/roles';
import { useAuth } from '../../hooks/useAuth';

const ICONS = {
  '/dashboard': <Dashboard />,
  '/analysis': <Analytics />,
  '/batch-analysis': <LibraryBooks />,
  '/history': <History />,
  '/statistics': <Analytics />,
  '/datasets': <Dataset />,
  '/models': <Storage />,
  '/training': <ModelTraining />,
  '/model-comparison': <CompareArrows />,
  '/news-sources': <Newspaper />,
  '/profile': <Person />,
  '/settings': <Settings />,
  '/admin/users': <People />,
  '/admin/statistics': <Shield />,
  '/admin/logs': <Shield />,
};

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  const items = visibleNav(user);
  const adminItems = visibleAdminNav(user);

  const linkSx = {
    mx: 1,
    mb: 0.5,
    borderRadius: 3,
    '&.active': { bgcolor: 'primary.main', color: 'primary.contrastText', '& .MuiListItemIcon-root': { color: 'inherit' } },
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', py: 2 }}>
      <Typography sx={{ px: 3, pb: 2, fontFamily: 'Fraunces, serif', fontSize: 22, color: 'primary.main' }}>
        Soul · SD
      </Typography>
      <List>
        {items.map((item) => (
          <ListItemButton key={item.path} component={NavLink} to={item.path} sx={linkSx} onClick={onNavigate}>
            <ListItemIcon sx={{ minWidth: 40 }}>{ICONS[item.path]}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      {adminItems.length > 0 && (
        <>
          <Divider sx={{ mx: 2, my: 1 }} />
          <Typography variant="caption" sx={{ px: 3, color: 'text.secondary' }}>Адміністрування</Typography>
          <List>
            {adminItems.map((item) => (
              <ListItemButton key={item.path} component={NavLink} to={item.path} sx={linkSx} onClick={onNavigate}>
                <ListItemIcon sx={{ minWidth: 40 }}>{ICONS[item.path]}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}
