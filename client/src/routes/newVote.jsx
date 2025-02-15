import { Box, Container, Grid } from "@mui/material";
import Navbar from "../components/navbar";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchMe, fetchGame, getAllVotableTracks } from "../../utils/apiCalls";

import OptionsDisplay from "../components/trackDisplays/optionsDisplay";

import { getTrackById, getMultipleTracksById } from "../../utils/spotifyCalls";
import { usefulTrackComponents } from "../../utils/spotifyApiUtils";

export default function NewVote() {
  const navigate = useNavigate();
  const { gameCode } = useParams();

  const [initialIds, setInitialIds] = useState([]);
  const [options, setOptions] = useState(null);
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
    const fetchOptions = async () => {
      const me = await fetchMe();
      const accessToken = me.access_token;
      if (initialIds.length > 0) {
        var allTracks = await getMultipleTracksById(accessToken, initialIds);
        allTracks = allTracks["tracks"];
        console.log("allTracks :>>", allTracks, "Type:", typeof allTracks);
        allTracks = allTracks.map((track) => usefulTrackComponents(track));
        setOptions(allTracks);
      }
    };

    fetchOptions();
  }, [initialIds]);

  // ✅ Log when `options` updates
  useEffect(() => {
    console.log("Updated options:", options);
  }, [options]);

  const testFunc = async () => {
    console.log("test");
  };

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
                <p>
                  {options ? (
                    <OptionsDisplay
                      tracks={options}
                      addFunc={testFunc}
                    ></OptionsDisplay>
                  ) : (
                    "No Options Found"
                  )}
                </p>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
