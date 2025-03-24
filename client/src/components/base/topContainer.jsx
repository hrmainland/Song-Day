import { Paper, Box, ThemeProvider } from "@mui/material";

import CenterBox from "./centerBox";

import theme from "../../../utils/theme";

export default function TopContainer({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <Paper
        sx={{
          width: "100%",
        }}
      >
        <CenterBox
          maxWidth="1000px"
          p={2}
        >
          {children}
        </CenterBox>
      </Paper>
    </ThemeProvider>
  );
}
