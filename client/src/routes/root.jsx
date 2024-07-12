import { Container, Grid, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";

function Root() {
  return (
    <>
      <div className="home-background">
        <Grid container spacing={2} justifyContent={"center"}>
          <Grid item xs={12} textAlign={"center"}>
            <h1>Song Day</h1>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Button variant="contained" component={Link} to={"/home"}>
              Home
            </Button>
          </Grid>
          <Grid item xs={3} textAlign="center">
            <Button variant="contained" component={Link} to={"/join-session"}>
              Join Session
            </Button>
          </Grid>

          <Grid item xs={3} textAlign="center">
            <Button variant="contained" component={Link} to={"/new-session"}>
              New Session
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Root;
