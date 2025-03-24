import { Paper, Box, ThemeProvider } from "@mui/material";

import theme from "../../utils/theme";

export default function TopContainer({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <Paper
        sx={{
          width: "100%",
          top: 0,
          left: 0,
          p: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: "1000px",
            marginLeft: "auto",
            marginRight: "auto",
            p: 0,
          }}
        >
          {children}
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
