import * as React from "react";
import { Box, Button, TextField, Container, Grid } from "@mui/material";
import baseUrl from "../../utils/urlPrefix";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import VoteDisplay from "../components/trackDisplays/voteDisplay";
import TrackList from "../components/trackList";

import {
  fetchMe,
  fetchGame,
  searchTracks,
  addSessionTracks,
  addTrackGroupToGame,
  isMyTrackGroupSubmitted,
  getAllGameTracks,
} from "../../utils/apiCalls";

function VoteSongs() {
  const { gameCode } = useParams();
  const [allTracks, SetAllTracks] = useState([]);

  useEffect(() => {
    const asyncFunc = async () => {
      const game = await fetchGame(gameCode);
      const allTracksResponse = await getAllGameTracks(game._id);
      SetAllTracks(allTracksResponse);
    };
    asyncFunc();
  }, []);

  return (
    <>
      <Navbar />
      <Container
        fixed
        className="top-container"
        sx={{
          mt: 5,
        }}
      >
        <Box display="flex" justifyContent="center">
          <VoteDisplay tracks={allTracks}></VoteDisplay>
        </Box>
      </Container>
    </>
  );
}

export default VoteSongs;
