// theme.js - COMPLETE ADAPTIVE THEME
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') => {
  return createTheme({
    palette: {
      mode: mode,
      ...(mode === 'light'
        ? {
            // Light mode colors
            primary: {
              main: '#1976d2',
              light: '#42a5f5',
              dark: '#1565c0',
            },
            secondary: {
              main: '#9c27b0',
              light: '#ba68c8',
              dark: '#7b1fa2',
            },
            success: {
              main: '#2e7d32',
            },
            warning: {
              main: '#ed6c02',
            },
            info: {
              main: '#0288d1',
            },
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
            text: {
              primary: '#1a1a1a',
              secondary: '#666666',
            },
          }
        : {
            // Dark mode colors
            primary: {
              main: '#90caf9',
              light: '#e3f2fd',
              dark: '#42a5f5',
            },
            secondary: {
              main: '#ce93d8',
              light: '#f3e5f5',
              dark: '#ab47bc',
            },
            success: {
              main: '#66bb6a',
            },
            warning: {
              main: '#ffa726',
            },
            info: {
              main: '#29b6f6',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: '#b0b0b0',
            },
          }),
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });
};
