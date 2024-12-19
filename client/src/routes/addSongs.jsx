import { Box, Button, TextField, Container, Grid, Badge } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import SearchDisplay from "../components/trackDisplays/searchDisplay";
import AddedDisplay from "../components/trackDisplays/addedDisplay";

import {
  fetchMe,
  fetchGame,
  addSessionTracks,
  addTrackGroupToGame,
  getMyTrackGroup,
} from "../../utils/apiCalls";

import { searchTracks } from "../../utils/spotifyCalls";

export default function AddSongs() {
  const navigate = useNavigate();
  const { gameCode } = useParams();

  const TRACK_KEY = `${gameCode}: tracks`;

  const [searchQuery, setSearchQuery] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  const [addView, setAddView] = useState(true);

  const [addedTracks, setAddedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mySubmitted, setMySubmitted] = useState(false);

  const [trackLimit, setTrackLimit] = useState(null);

  useEffect(() => {
    const isSubmitted = async () => {
      const game = await fetchGame(gameCode);
      setTrackLimit(game.config.nSongs);
      const trackGroup = await getMyTrackGroup(game._id);
      const isSubmitted = Boolean(trackGroup);
      setMySubmitted(isSubmitted);
      setLoading(false);
    };
    isSubmitted();
  }, []);

  const updateView = (event) => {
    event.preventDefault();
    setAddView(!addView);
  }

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
    if (trackLimit - getSessionTracks().length > 0) {
      addTrackToSession(track);
      const sessionTracks = getSessionTracks();
      setAddedTracks(sessionTracks);

      const idsToRemove = new Set(sessionTracks.map(item => item.id));
      searchResult.tracks.items = searchResult.tracks.items.filter(track => !idsToRemove.has(track.id));
      setSearchResult(searchResult);
    }
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
    getSessionTracks();
    const trackGroup = await addSessionTracks(getSessionTracks());
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
      <Button component={Link} to={`/session/${gameCode}`}>
        <ArrowBackIcon />
      </Button>
      <Container
        fixed
        className="top-container"
      >
        {mySubmitted ? (
          <Box display="flex" justifyContent="center">
            <h2>You've already submitted your tracks</h2>
          </Box>
        ) : (
          <>

          <Grid container>
            <Grid item xs={12} display="flex" justifyContent="center" marginY={2}>
              {addView ? (
                <Badge badgeContent={addedTracks.length} color="warning">
                  <Button onClick={() => setAddView(false)} variant="contained">
                    View My List
                  </Button>
                </Badge>
              ) : (
                <Button onClick={() => setAddView(true)} variant="outlined">
                  Add Tracks
                </Button>
              )}
            </Grid>
          </Grid>

          
          {addView ? (<Box display="flex" justifyContent="center">
              <Grid container maxWidth={1000} spacing={2}>
                <Grid item xs={12}>
                  <form onSubmit={updateView}>
                  </form>
                </Grid>
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
                      <Grid item xs={4} display="flex" justifyContent="center">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Search
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
            </Box>) : (<Box display="flex" justifyContent="center">
              <Grid container maxWidth={1000} spacing={2}>
                <Grid item xs={12}>
                  <AddedDisplay
                  tracks={getSessionTracks()}
                  removeFunc={removeTrack}
                  submitFunc={handleSubmit}
                  missingTracks={trackLimit - getSessionTracks().length}
                />
                </Grid>
              </Grid>
            </Box>)}
            
            
          </>
        )}
      </Container>
    </>
  );
}

