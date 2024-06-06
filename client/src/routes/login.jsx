import baseUrl from "../../utils/urlPrefix";
import * as React from "react";
import { Container, Grid, Button, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";

function Login() {
  const [searchParams] = useSearchParams();
  const paramsObj = Object.fromEntries([...searchParams]);
  return (
    <Container maxWidth="sm">
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} textAlign={"center"}>
          <h1>Login</h1>
        </Grid>
        <Grid item xs={8}>
          <form action={`${baseUrl}/user/auth`}>
            {paramsObj["from"] && (
              <input type="hidden" name="from" value={`${paramsObj["from"]}`} />
            )}
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
