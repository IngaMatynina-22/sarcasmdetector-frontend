import { Menu } from '@mui/icons-material';
import { AppBar, Box, Button, Chip, IconButton, Toolbar, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { useLogoutMutation } from '../../services/apiEndpoints';
import { useAuth } from '../../hooks/useAuth';

export default function Header({ onMenu }) {
  const { user, role } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [doLogout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await doLogout().unwrap();
    } catch {
      /* ignore */
    }
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="transparent" sx={{ backdropFilter: 'blur(10px)', bgcolor: 'rgba(246,237,226,0.85)' }}>
      <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
        <IconButton onClick={onMenu} sx={{ display: { md: 'none' } }} aria-label="Меню">
          <Menu />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: 16, sm: 20 } }} noWrap>
          SarcasmDetector
        </Typography>
        <Chip size="small" label={role || '…'} sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />
        <Box sx={{ display: { xs: 'none', sm: 'block' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
          {user?.full_name || user?.email}
        </Box>
        <Button size="small" variant="contained" onClick={handleLogout}>Вихід</Button>
      </Toolbar>
    </AppBar>
  );
}
