import * as React from "react";
import { Box, Button, TextField, Container, Grid } from "@mui/material";
import baseUrl from "../../utils/urlPrefix";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import SearchDisplay from "../components/searchDisplay";
import TrackList from "../components/trackList";

import { fetchMe, searchTracks } from "../../utils/apiCalls";

function AddSongs() {
  const [searchQuery, setSearchQuery] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  const submit = async () => {
    const me = await fetchMe();
    const accessToken = me.access_token;
    const result = await searchTracks(accessToken, searchQuery);
    console.log("result :>> ", result);
    setSearchResult(result);
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
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                      label="Search"
                    />
                  </Grid>

                  <Grid item xs={3} display="flex" justifyContent="center">
                    <Button type="submit" variant="contained" color="primary">
                      Submit
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
                  ></SearchDisplay>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
        {Boolean(searchResult) && (
          <Grid item xs={12}>
            <SearchDisplay
              tracks={searchResult.tracks.items}
              rhs={true}
            ></SearchDisplay>
          </Grid>
        )}
      </Container>
    </>
  );
}

export default AddSongs;
