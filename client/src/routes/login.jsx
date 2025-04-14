import baseUrl from "../../utils/urlPrefix";
import { Container, Grid, Button, Box } from "@mui/material";

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} textAlign={"center"}>
          <h1>Login</h1>
        </Grid>
        <Grid item xs={8}>
          {/* TODO put this into api calls */}
          <form action={`${baseUrl}/user/auth`}>
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