import { Container, Grid, Button, Box } from "@mui/material";
import Navbar from "../navbar";

function Root() {
  return (
    <>
      <div className="home-background">
        <Grid container spacing={2} justifyContent={"center"}>
          <Grid item xs={12} textAlign={"center"}>
            <h1>Song Day</h1>
          </Grid>
          <Grid item xs={3} textAlign="center">
            <Box>
              <form action="/join-session">
                <Button type="submit" variant="contained">
                  Join Session
                </Button>
              </form>
            </Box>
          </Grid>

          <Grid item xs={3} textAlign="center">
            <Box>
              <form action="/new-session">
                <Button type="submit" variant="contained">
                  New Session
                </Button>
              </form>
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Root;
