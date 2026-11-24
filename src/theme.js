import { createTheme } from '@mui/material/styles';

const mocha = {
  50: '#F6EDE2',
  100: '#EEDFCF',
  200: '#E2C9B0',
  300: '#C9A48A',
  400: '#A87455',
  500: '#7A4A32',
  600: '#5C3A21',
  700: '#4A2C1A',
};

export function buildTheme(mode = 'light', density = 'comfortable') {
  const dark = mode === 'dark';
  return createTheme({
    spacing: density === 'compact' ? 6 : 8,
    palette: {
      mode,
      primary: { main: mocha[500], contrastText: '#FFF8F0' },
      secondary: { main: mocha[400] },
      background: {
        default: dark ? '#2A1C14' : mocha[50],
        paper: dark ? '#3A281C' : '#FFF8F0',
      },
      text: {
        primary: dark ? '#F6EDE2' : mocha[700],
        secondary: dark ? '#E2C9B0' : '#6B4A38',
      },
      success: { main: '#6B7F4E' },
      warning: { main: '#C4A35A' },
      error: { main: '#A65D4E' },
      divider: dark ? 'rgba(246,237,226,0.12)' : 'rgba(74,44,26,0.12)',
    },
    typography: {
      fontFamily: '"Outfit", "Segoe UI", sans-serif',
      h1: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 500 },
      h2: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 500 },
      h3: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 500 },
      h4: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 500, letterSpacing: '-0.02em' },
      h5: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 500 },
      h6: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 500 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 22 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 999, px: 2.5, py: 1.1, minHeight: 44 },
          contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
          outlined: { borderWidth: 1.5 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 28,
            boxShadow: 'none',
            border: dark ? '1px solid rgba(246,237,226,0.08)' : '1px solid rgba(74,44,26,0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: dark ? 'rgba(255,255,255,0.04)' : '#FFF8F0',
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { borderRadius: 999 } },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundImage: 'none', boxShadow: 'none' },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: { overflowX: 'auto', borderRadius: 20 },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: { backgroundColor: 'transparent' },
        },
      },
    },
  });
}

export const CHART = ['#7A4A32', '#C9A48A', '#C4A35A', '#5C3A21'];
