import React, { createContext, useState, useContext, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Create context
export const ThemeContext = createContext();

// Create hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // Create theme based on current mode
  const theme = useMemo(
    () => createTheme({
      palette: {
        mode,
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
        background: {
          default: mode === 'light' ? '#f5f5f5' : '#121212',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
          fontWeight: 500,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 600,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};