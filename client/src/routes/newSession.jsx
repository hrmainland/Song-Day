/* eslint-disable no-undef */
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import baseUrl from "../../utils/urlPrefix";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

import { addGameToMe, newGame } from "../../utils/apiCalls";

function NewSession() {
  const navigate = useNavigate();
  const [numSongs, setNumSongs] = useState([]);
  const [numVotes, setNumVotes] = useState([]);
  const [gameName, setGameName] = useState([]);

  const submit = async () => {
    const settings = { numSongs, numVotes };
    const game = await newGame(gameName, settings);
    await addGameToMe(game._id);
    navigate(`/new-session/game-code/${game.gameCode}`);
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
            <h1>Create Session</h1>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      onChange={(e) => {
                        setGameName(e.target.value);
                      }}
                      label="Game Name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      inputProps={{ type: "number" }}
                      onChange={(e) => {
                        setNumSongs(e.target.value);
                      }}
                      label="Songs Per Player"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      inputProps={{ type: "number" }}
                      onChange={(e) => {
                        setNumVotes(e.target.value);
                      }}
                      label="Votes Per Player"
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

export default NewSession;
