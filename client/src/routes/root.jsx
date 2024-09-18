import { Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div className="home-background">
        <Grid container spacing={6} justifyContent={"center"}>
          <Grid item xs={12} textAlign={"center"}>
            <h1 className="heading">Song Day</h1>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Button
              variant="outlined"
              component={Link}
              to="/home"
              sx={{
                textTransform: "none",
                color: "white",
                borderColor: "lightslategray",
                "&:hover": {
                  borderColor: "white",
                },
                fontSize: "1.1rem",
                fontFamily: "Inria Sans",
              }}
            >
              Get Started
            </Button>
          </Grid>

          {/* <Grid item xs={3} textAlign="center">
            <Button
              variant="outlined"
              component={Link}
              to={"/join-session"}
              sx={{ textTransform: "none", color: "white" }}
            >
              Join Session
            </Button>
          </Grid>

          <Grid item xs={3} textAlign="center">
            <Button
              variant="outlined"
              component={Link}
              to={"/new-session"}
              sx={{ textTransform: "none", color: "white" }}
            >
              Create Session
            </Button>
          </Grid> */}
        </Grid>
      </div>
    </>
  );
}
