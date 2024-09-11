import { useParams } from "react-router-dom";

/* eslint-disable no-undef */
import { Box, Container, Grid, Button } from "@mui/material";

import Navbar from "../components/navbar";

function NewSessionCode() {
  const { gameCode } = useParams();

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
        {/* form goes here */}
        <Box display="flex" justifyContent="center">
          <Grid container maxWidth={600}>
            <h1>Create New Session</h1>
            <Grid item xs={12}>
              <p>
                Your Game Code is: <b>{gameCode}</b>
              </p>
              <p>Share this with all players</p>
            </Grid>
            <form action={`/session/${gameCode}`}>
              <Button type="submit">Continue</Button>
            </form>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default NewSessionCode;
