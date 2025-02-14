import {
  Box,
  Container,
  Grid,
} from "@mui/material";
import Navbar from "../components/navbar";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchMe,
  fetchGame,
  getAllVotableTracks,
} from "../../utils/apiCalls";

import { getTrackById } from "../../utils/spotifyCalls";

export default function NewVote() {
  const navigate = useNavigate();
  const { gameCode } = useParams();

  const [initialIds, setInitialIds] = useState([]);
  const [topTrack, setTopTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAndSetIds = async (game) => {
    const tracksResponse = await getAllVotableTracks(game._id);
    setInitialIds(tracksResponse);
  };

  // get trackIds on mount
  useEffect(() => {
    const asyncFunc = async () => {
      const game = await fetchGame(gameCode);
      await fetchAndSetIds(game);
      setLoading(false);
    };
    asyncFunc();
  }, []);

  // set top track (DELETE)
  useEffect(() => {
    const fetchTopTrack = async () => {
      const me = await fetchMe();
      const accessToken = me.access_token;
      if (initialIds.length > 0) {
        const track = await getTrackById(accessToken, initialIds[0]);
        setTopTrack(track["name"]);
      }
    };

    fetchTopTrack();
  }, [initialIds]);

  // ✅ Log when `topTrack` updates
  useEffect(() => {
    console.log("Updated topTrack:", topTrack);
  }, [topTrack]);

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
          <Grid container maxWidth={600}>
            <Grid item xs={12}>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <p>{topTrack ? JSON.stringify(topTrack) : "No top track found"}</p>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
