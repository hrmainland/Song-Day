import * as React from "react";
import { Box, Button, TextField, Container, Grid } from "@mui/material";
import baseUrl from "../../utils/urlPrefix";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import SearchDisplay from "../components/trackDisplays/searchDisplay";
import AddedDisplay from "../components/trackDisplays/addedDisplay";
import TrackList from "../components/trackList";

import {
  fetchMe,
  fetchGame,
  searchTracks,
  addSessionTracks,
  addTrackGroupToGame,
  isMyTrackGroupSubmitted,
} from "../../utils/apiCalls";

function VoteSongs() {
  const { gameCode } = useParams();

  return (
    <>
      <Navbar />
      <Container
        fixed
        className="top-container"
        sx={{
          mt: 5,
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 2,
          position: "relative",
        }}
      >
        <Box display="flex" justifyContent="center">
          Vote For songs
        </Box>
      </Container>
    </>
  );
}

export default VoteSongs;
