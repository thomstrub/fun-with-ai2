import { createTheme } from '@mui/material/styles';

// 90s-inspired color palette with Material Design principles
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF1493', // Hot Pink
      dark: '#C71585', // Deep Magenta
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9D4EDD', // Electric Purple
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#39FF14', // Lime Green
      contrastText: '#333333',
    },
    error: {
      main: '#FF6B6B', // Error Red
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FF8C00', // Warning Orange
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5', // Off-White
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333', // Dark Gray
      secondary: '#757575', // Light Gray
    },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      color: '#333333',
    },
    h2: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#333333',
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#9D4EDD',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#333333',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      color: '#757575',
    },
    button: {
      fontSize: '14px',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  spacing: 8, // 8px baseline grid
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 12px',
          fontWeight: 600,
          border: '1px solid',
          transition: 'all 0.3s ease',
          '&:focus': {
            outline: '2px solid #9D4EDD',
            outlineOffset: '2px',
          },
        },
        contained: {
          backgroundColor: '#FF1493',
          borderColor: '#C71585',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#C71585',
            borderColor: '#FF1493',
          },
        },
        outlined: {
          backgroundColor: '#F5F5F5',
          borderColor: '#9D4EDD',
          color: '#333333',
          '&:hover': {
            backgroundColor: '#E0E0E0',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#FF1493',
          },
          '&:focus': {
            outline: '2px solid #9D4EDD',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F5F5',
          border: '1px solid #E0E0E0',
          padding: '16px',
          borderRadius: 4,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#9D4EDD',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            '&.Mui-focused fieldset': {
              borderColor: '#9D4EDD',
              borderWidth: '2px',
            },
            '&:focus': {
              outline: '2px solid #9D4EDD',
              outlineOffset: '2px',
            },
          },
        },
      },
    },
  },
});

export default theme;
