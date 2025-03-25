import { Paper, Box, ThemeProvider } from "@mui/material";

import CenterBox from "./centerBox";

import theme from "../../../utils/theme";

export default function BottomContainer({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <Paper
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          display:{
            xs: "flex",
            sm: "none",
          },
        }}
      >
        <Box
          sx={{
            maxWidth: "1000px",
            marginLeft: "auto",
            marginRight: "auto",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
            {children}
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
