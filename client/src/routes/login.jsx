import baseUrl from "../../utils/urlPrefix";
import * as React from "react";
import { Container, Grid, Button } from "@mui/material";

function Login() {
  const styles = { width: "100%" };
  return (
    <Container maxWidth="md">
      <Grid container justifyContent="center" spacing={5}>
        <Grid item xs={8}>
          <h1>Log In</h1>
        </Grid>
        <Grid item xs={8}>
          <form action={`${baseUrl}/spotify/auth`}>
            <Grid container justifyContent="center" spacing={5}>
              <Grid item xs={8}>
                <Button type="submit" style={styles} variant="contained">
                  Continue with Spotify
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
