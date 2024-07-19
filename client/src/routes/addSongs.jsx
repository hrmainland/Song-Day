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

function AddSongs() {
  const navigate = useNavigate();
  const { gameCode } = useParams();

  const TRACK_KEY = `${gameCode}: tracks`;

  const [searchQuery, setSearchQuery] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  const [addedTracks, setAddedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mySubmitted, setMySubmitted] = useState(false);

  useEffect(() => {
    const isSubmitted = async () => {
      const game = await fetchGame(gameCode);
      const isSubmitted = await isMyTrackGroupSubmitted(game._id);
      setMySubmitted(isSubmitted);
      setLoading(false);
    };
    isSubmitted();
  }, []);

  const getSessionTracks = () => {
    let tracks = localStorage.getItem(TRACK_KEY);
    try {
      const result = JSON.parse(tracks);
      if (!result) {
        return [];
      }
      return result;
    } catch {
      return [];
    }
  };

  const checkForDuplicate = (newTrack, tracks) => {
    const ids = tracks.map((track) => {
      return track.id;
    });
    return ids.includes(newTrack.id);
  };

  const addTrackToSession = (track) => {
    var tracks = getSessionTracks();
    const isDuplicate = checkForDuplicate(track, tracks);
    if (!isDuplicate) {
      tracks.push(track);
      localStorage.setItem(TRACK_KEY, JSON.stringify(tracks));
    }
  };

  const removeTrackFromSession = (track) => {
    var tracks = getSessionTracks();
    tracks = tracks.filter((song) => {
      if (song.id != track.id) {
        return song;
      }
    });
    localStorage.setItem(TRACK_KEY, JSON.stringify(tracks));
  };

  const addTrack = (track) => {
    addTrackToSession(track);
    const sessionTracks = getSessionTracks();
    setAddedTracks(sessionTracks);
  };

  const removeTrack = (track) => {
    removeTrackFromSession(track);
    const sessionTracks = getSessionTracks();
    setAddedTracks(sessionTracks);
  };

  const search = async () => {
    const me = await fetchMe();
    const accessToken = me.access_token;
    const result = await searchTracks(accessToken, searchQuery);
    setSearchResult(result);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    search();
  };

  const handleSubmit = async () => {
    // add error handling here
    const game = await fetchGame(gameCode);
    const trackGroup = await addSessionTracks(
      JSON.stringify({ sessionTracks: getSessionTracks() })
    );
    const updatedGame = await addTrackGroupToGame(game._id, trackGroup._id);
    // TODO add some error handling before displaying this success message
    navigate(`/session/${gameCode}`, {
      state: { alertMsg: "Your songs were successfully added to the session" },
    });
  };

  const removeAllTracks = () => {
    localStorage.setItem(TRACK_KEY, JSON.stringify([]));
    setAddedTracks([]);
  };
  if (loading) {
    return <p>Loading...</p>;
  }

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
        {mySubmitted ? (
          <Box display="flex" justifyContent="center">
            <h2>You've already submitted your tracks</h2>
          </Box>
        ) : (
          <>
            <Box display="flex" justifyContent="center">
              <Grid container maxWidth={600} spacing={2}>
                <Grid item xs={12}>
                  <form onSubmit={handleSearch} style={{ width: "100%" }}>
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
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
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
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Box>
            <AddedDisplay
              tracks={getSessionTracks()}
              removeFunc={removeTrack}
              submitFunc={handleSubmit}
            />
          </>
        )}
      </Container>
    </>
  );
}

export default AddSongs;
