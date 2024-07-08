import baseUrl from "../../utils/urlPrefix";
import {
  addGameToMe,
  addMeToGame,
  fetchGame,
  fetchUserId,
} from "../../utils/apiCalls";

/* eslint-disable no-undef */
import * as React from "react";
import { Box, Button, TextField, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

function JoinSession() {
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState([]);

  const submit = async () => {
    const game = await fetchGame(sessionCode);
    if (!game) {
      // TODO update this
      setErrorMsg("Couldn't find that game");
      return;
    }
    const userId = await fetchUserId();
    if (game.players.includes(userId)) {
      setErrorMsg("You're already part of that game");
      // TODO navigate to that game
      return;
    }
    addGameToMe(game._id);
    console.log("here");
    addMeToGame(game._id);
    navigate(`/session/${game.gameCode}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

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
            <h1>Enter Session Code</h1>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Grid container spacing={2}>
                  {errorMsg !== "" && (
                    <Grid item xs={12}>
                      <Box component="p" sx={{ color: "red" }}>
                        {errorMsg}
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      onChange={(e) => {
                        setSessionCode(e.target.value);
                      }}
                      label="Session Code"
                    />
                  </Grid>

                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Button type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default JoinSession;
