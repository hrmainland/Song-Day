/* eslint-disable no-undef */
import { memo, useEffect, useState } from "react";
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

import { addGameToMe, newGame} from "../../utils/apiCalls";


// testing
import {fetchMe, refreshToken} from "../../utils/apiCalls";
import { getRefreshToken } from "../../utils/spotifyCalls";

export default function NewGame() {
  const navigate = useNavigate();
  const [numSongs, setNumSongs] = useState(null);
  const [numVotes, setNumVotes] = useState(null);
  const [gameName, setGameName] = useState(null);

  // testing
  const [me, setMe] = useState(null);
  const [returnValue, setReturnValue] = useState(null);

  const submit = async () => {
    if (!gameName || !numSongs || !numVotes) {
      return;
    }
    const settings = { numSongs, numVotes };
    const game = await newGame(gameName, settings);
    await addGameToMe(game._id);
    navigate(`/new-session/game-code/${game.gameCode}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const meData = await fetchMe();
      setMe(meData);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const refresh = async () => {
      if (me) {
        setReturnValue(await getRefreshToken(me));
      }
    };
    refresh();
  }, [me]);

  useEffect(() => {
    console.log(returnValue);
  }, [returnValue]);

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
