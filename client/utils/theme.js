
import { createTheme } from "@mui/material/styles";


const theme = createTheme({
  palette: {
    primary: {
      main: '#407ea0',
    },
    secondary: {
      main: '##C28868',
    },
  },
  breakpoints: {
    values: {
      xxs: 0,
      xs: 450,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
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
