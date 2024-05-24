import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, Button, Grid, Typography } from "@mui/material";
import Navbar from "../navbar";
import Sessions from "../sessions";

const theme = createTheme();

theme.typography.h3 = {
  fontSize: "1.6rem",
  "@media (min-width:600px)": {
    fontSize: "2rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2rem",
  },
};

function Home() {
  return (
    <>
      <Navbar></Navbar>
      <Container
        fixed
        className="top-container"
        sx={{
          mt: 5,
        }}
      >
        <Grid container>
          <Grid item xs={12} md={8}>
            <ThemeProvider theme={theme}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  textAlign: {
                    xs: "center",
                    md: "left",
                  },
                }}
              >
                Your Sessions
              </Typography>
            </ThemeProvider>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            xs={12}
            md={4}
          >
            <Grid item>
              <Button variant="outlined">Create Session</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">Join Session</Button>
            </Grid>
          </Grid>
        </Grid>
        <Sessions></Sessions>
      </Container>
    </>
  );
}

export default Home;
