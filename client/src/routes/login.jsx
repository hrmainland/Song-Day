import baseUrl from "../../utils/urlPrefix";
import * as React from "react";
import { Container, Grid, Button, Box } from "@mui/material";

function Login() {
  return (
    <Container maxWidth="sm">
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} textAlign={"center"}>
          <h1>Login</h1>
        </Grid>
        <Grid item xs={8}>
          <form action={`${baseUrl}/user/auth?jeff=hello`}>
            <Button
              type="submit"
              textAlign={"center"}
              variant="contained"
              sx={{ width: "100%" }}
            >
              Continue with Spotify
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
