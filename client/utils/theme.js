
import { createTheme } from "@mui/material/styles";


const theme = createTheme({
  palette: {
    primary: {
      main: '#407BFF'
    },
    secondary: {
      main: '#5D4A9C',
      light: '#7966b8',
      dark: '#42357d',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#F44336',
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    h2: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    h3: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    h4: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    h5: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    h6: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    subtitle1: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    subtitle2: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    body1: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    body2: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    button: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
    overline: {
      fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      twocard: 652,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
