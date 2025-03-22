import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#0000FF", // Blue
      light: "#2196F3", // Light blue
      dark: "#1976D2", // Dark blue
    },
    secondary: {
      main: "#FF0000", // Red

    },
    complementary: {
      main: "#000000", // Green
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Example override
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
