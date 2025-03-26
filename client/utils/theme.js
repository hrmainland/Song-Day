
import { createTheme } from "@mui/material/styles";


const theme = createTheme({
  palette: {
    primary: {
      main: '#407ea0',
      light: '#6ba4c2',
      dark: '#2b5a78',
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
      xxs: 0,
      xs: 450,
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


// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#0000FF", // Blue
//       light: "#2196F3", // Light blue
//       dark: "#1976D2", // Dark blue
//     },
//     secondary: {
//       main: "#FF0000", // Red

//     },
//     complementary: {
//       main: "#000000", // Green
//     },
//   },
//   typography: {
//     fontFamily: "Arial, sans-serif",
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none", // Example override
//           borderRadius: 8,
//         },
//       },
//     },
//   },
// });

export default theme;
