import * as React from "react";
import { Box, Button, TextField, Container, Grid } from "@mui/material";
import baseUrl from "../../utils/urlPrefix";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import SearchDisplay from "../components/trackDisplays/searchDisplay";
import AddedDisplay from "../components/trackDisplays/addedDisplay";
import TrackList from "../components/trackList";

import { fetchMe, searchTracks } from "../../utils/apiCalls";

function AddSongs() {
  const [searchQuery, setSearchQuery] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [addedTracks, setAddedTracks] = useState([]);
  const [loadingAdded, setLoadingAdded] = useState(true);

  // get tracks from session on first render
  useEffect(() => {
    const tracks = getSessionTracks();
    setAddedTracks(tracks);
    setLoadingAdded(false);
  }, []);

  // update the session when the state changes
  useEffect(() => {
    localStorage.setItem("tracks", JSON.stringify(addedTracks));
    console.log(
      'localStorage.getItem("tracks") :>> ',
      localStorage.getItem("tracks")
    );
  }, [addedTracks]);

  const getSessionTracks = () => {
    let tracks = localStorage.getItem("tracks");
    try {
      return JSON.parse(tracks);
    } catch {
      return [];
    }
  };

  // reverse this so it gets added to the local storage and then pulled into the state

  const addTrack = (track) => {
    setAddedTracks((prevAddedTracks) => {
      const newAddedTracks = [...prevAddedTracks, track];
      return newAddedTracks;
    });
  };

  // const addTrack = (track) => {
  //   let tracks = getAddedTracks();
  //   tracks.push(track);
  //   localStorage.setItem("tracks", JSON.stringify(tracks));
  //   console.log(localStorage.getItem("tracks"));
  // };

  const submit = async () => {
    const me = await fetchMe();
    const accessToken = me.access_token;
    const result = await searchTracks(accessToken, searchQuery);
    setSearchResult(result);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  const removeAllTracks = () => {
    localStorage.setItem("tracks", JSON.stringify([]));
    setAddedTracks([]);
  };

  return (
    <>
      <Navbar></Navbar>
      <Container
        fixed
        className="top-container"
        sx={{
          mt: 5,
          display: "grid",
          gridTemplateColumns: "1fr 360px", // Two columns: one for content and one for TrackList
          gap: 2,
          position: "relative", // Relative positioning for the grid container
        }}
      >
        <Box display="flex" justifyContent="center">
          <Grid container maxWidth={600} spacing={2}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                      label="Search"
                    />
                  </Grid>

                  <Grid item xs={2} display="flex" justifyContent="center">
                    <Button type="submit" variant="contained" color="primary">
                      Search
                    </Button>
                  </Grid>
                  <Grid item xs={2} display="flex" justifyContent="center">
                    <Button
                      onClick={removeAllTracks}
                      variant="contained"
                      color="primary"
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12}>
              {Boolean(searchResult) && (
                <Grid item xs={12}>
                  <SearchDisplay
                    tracks={searchResult.tracks.items}
                    addFunc={addTrack}
                  ></SearchDisplay>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
        {!loadingAdded && <AddedDisplay />}
      </Container>
    </>
  );
}

export default AddSongs;
