import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  Grid,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Dialog,
  TextField,
} from "@mui/material";

import Navbar from "../components/navbar";
import CenterBox from "../components/base/centerBox";
import TopContainer from "../components/base/topContainer";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  fetchMe,
  fetchGame,
  addSessionTracks,
  addTrackGroupToGame,
  getMyTrackGroup,
} from "../../utils/apiCalls";

import { searchTracks } from "../../utils/spotifyCalls";
import { artistString } from "../../utils/spotifyApiUtils";

// Define keyframes for spinner animation
const spinAnimation = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export default function AddSongs() {
  const navigate = useNavigate();
  const { gameCode } = useParams();

  const TRACK_KEY = `${gameCode}: tracks`;

  // Game state
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mySubmitted, setMySubmitted] = useState(false);
  const [trackLimit, setTrackLimit] = useState(null);
  const [gameName, setGameName] = useState("");

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef(null);

  // Track state
  const [addedTracks, setAddedTracks] = useState([]);

  // Initialize component and check if user has already submitted
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const gameData = await fetchGame(gameCode);
        setGame(gameData);
        setGameName(gameData.gameName);
        setTrackLimit(gameData.config.nSongs);

        // Check if user has already submitted tracks
        const trackGroup = await getMyTrackGroup(gameData._id);
        const isSubmitted = Boolean(trackGroup);
        setMySubmitted(isSubmitted);

        // Load tracks from local storage
        const storedTracks = getSessionTracks();
        setAddedTracks(storedTracks);
      } catch (error) {
        console.error("Error initializing component:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, [gameCode]);

  // Search dialog handlers
  const handleSearchOpen = () => {
    setSearchOpen(true);
    // Focus the search input when dialog opens
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchResult(null);
    setSearchQuery("");
  };

  // Get tracks from local storage
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

  // Check for duplicate tracks
  const checkForDuplicate = (newTrack, tracks) => {
    const ids = tracks.map((track) => track.id);
    return ids.includes(newTrack.id);
  };

  // Add track to session
  const addTrackToSession = (track) => {
    const tracks = getSessionTracks();
    const isDuplicate = checkForDuplicate(track, tracks);
    if (!isDuplicate) {
      tracks.push(track);
      localStorage.setItem(TRACK_KEY, JSON.stringify(tracks));
      setAddedTracks(tracks);
    }
  };

  // Remove track from session
  const removeTrackFromSession = (track) => {
    let tracks = getSessionTracks();
    tracks = tracks.filter((song) => song.id !== track.id);
    localStorage.setItem(TRACK_KEY, JSON.stringify(tracks));
    setAddedTracks(tracks);
  };

  // Search for tracks
  const performSearch = async (query) => {
    if (!query || query.trim().length < 3) {
      setSearchResult(null);
      return;
    }

    try {
      setSearching(true);
      const me = await fetchMe();
      const accessToken = me.access_token;
      const result = await searchTracks(accessToken, query);

      // Filter out tracks that are already added
      const currentTracks = getSessionTracks();
      const currentTrackIds = new Set(currentTracks.map((track) => track.id));

      if (result && result.tracks && result.tracks.items) {
        result.tracks.items = result.tracks.items.filter(
          (track) => !currentTrackIds.has(track.id)
        );
      }

      setSearchResult(result);
    } catch (error) {
      console.error("Error searching tracks:", error);
    } finally {
      setSearching(false);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchOpen && searchQuery.trim().length >= 3) {
        performSearch(searchQuery);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, searchOpen]);

  // Handle search form submission
  const handleSearch = (event) => {
    event?.preventDefault();
    performSearch(searchQuery);
  };

  // Add track to user's list
  const addTrack = (track) => {
    if (trackLimit && addedTracks.length >= trackLimit) {
      // Could show an error message here
      return;
    }

    addTrackToSession(track);

    // Remove track from search results to avoid duplicates
    if (searchResult && searchResult.tracks && searchResult.tracks.items) {
      const updatedItems = searchResult.tracks.items.filter(
        (item) => item.id !== track.id
      );
      setSearchResult({
        ...searchResult,
        tracks: {
          ...searchResult.tracks,
          items: updatedItems,
        },
      });
    }
  };

  // Format track from Spotify API response
  const formatTrack = (track) => {
    const artists = artistString(track.artists);
    const img =
      track.album.images.length > 0 ? track.album.images[2]?.url : null;
    return {
      id: track.id,
      name: track.name,
      artists,
      img,
      album: track.album.name,
      duration_ms: track.duration_ms,
    };
  };

  // Format track duration
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Submit tracks to session
  const handleSubmit = async () => {
    try {
      const game = await fetchGame(gameCode);
      const storedTracks = getSessionTracks();

      if (storedTracks.length < trackLimit) {
        // Could show an error message about not having enough tracks
        return;
      }

      const trackGroup = await addSessionTracks(storedTracks);
      const updatedGame = await addTrackGroupToGame(game._id, trackGroup._id);

      // Clear local storage
      localStorage.removeItem(TRACK_KEY);

      // Navigate back to session page with success message
      navigate(`/session/${gameCode}`, {
        state: {
          alertMsg: "Your songs were successfully added to the session",
        },
      });
    } catch (error) {
      console.error("Error submitting tracks:", error);
      // Could show an error message here
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <style>{spinAnimation}</style>
      <Navbar />

      <TopContainer sx={{ pb: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              component={Link}
              to={`/session/${gameCode}`}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography
                variant="h5"
                fontWeight="500"
                sx={{ letterSpacing: "-0.5px" }}
              >
                Add Tracks
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight="400"
              >
                {gameName}
              </Typography>
            </Box>
          </Box>

          {!mySubmitted && (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ borderRadius: "12px" }}
              onClick={handleSubmit}
              disabled={addedTracks.length < trackLimit}
            >
              Submit Tracks
            </Button>
          )}
        </Box>
      </TopContainer>

      {mySubmitted ? (
        <CenterBox
          maxWidth="1000px"
          p={3}
          sx={{
            mt: 2,
            mb: 4,
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
            You've already submitted your tracks
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary">
            Your tracks have been successfully added to the session. Check back
            later to see the final playlist.
          </Typography>
        </CenterBox>
      ) : (
        <Box sx={{ mt: 2, mb: 4 }}>
          <CenterBox
            maxWidth="1000px"
            p={3}
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="500"
                  sx={{ letterSpacing: "-0.3px" }}
                >
                  Your List ({addedTracks.length}/{trackLimit})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trackLimit - addedTracks.length} tracks needed
                </Typography>
              </Box>

              <Box
                onClick={handleSearchOpen}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  paddingLeft: "20px",
                  paddingRight: "10px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  height: 42,
                  width: "100%",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "inherit",
                    fontSize: "1rem",
                    flexGrow: 1,
                    lineHeight: "40px",
                    opacity: 0.4,
                  }}
                >
                  Search for songs to add
                </Typography>
                <IconButton sx={{ p: "6px" }}>
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>

            {addedTracks.length > 0 ? (
              <Paper sx={{ borderRadius: "12px", overflow: "hidden", mb: 2 }}>
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  <ListItem
                    sx={{
                      pt: 2,
                      bgcolor: "rgba(0,0,0,0.02)",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                    }}
                    secondaryAction={
                      <IconButton edge="end" sx={{ mr: 2 }}>
                        <Box sx={{ width: 24, height: 24 }} />
                      </IconButton>
                    }
                  >
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ height: "100%" }}
                    >
                      <Grid
                        item
                        xs={1}
                        sx={{ display: { xs: "none", md: "block" } }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          align="center"
                        >
                          #
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1}>
                        <Box
                          sx={{
                            width: 45,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <ListItemText
                          secondary="TITLE"
                          secondaryTypographyProps={{
                            variant: "caption",
                            sx: {
                              color: "text.secondary",
                              fontWeight: 600,
                              letterSpacing: "0.5px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        sx={{ display: { xs: "none", md: "block" } }}
                      >
                        <ListItemText
                          secondary="ALBUM"
                          secondaryTypographyProps={{
                            variant: "caption",
                            sx: {
                              color: "text.secondary",
                              fontWeight: 600,
                              letterSpacing: "0.5px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Box display="flex" justifyContent="flex-start">
                          <AccessTimeIcon
                            fontSize="small"
                            sx={{ color: "text.secondary" }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </ListItem>

                  {addedTracks.map((track, index) => (
                    <ListItem
                      key={track.id}
                      sx={{
                        py: 1.5,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.04)",
                          "& .MuiIconButton-root": { opacity: 1 },
                        },
                        borderBottom:
                          index < addedTracks.length - 1
                            ? "1px solid rgba(0,0,0,0.06)"
                            : "none",
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => removeTrackFromSession(track)}
                          sx={{
                            color: "text.secondary",
                            "&:hover": { color: "error.main" },
                            opacity: 0,
                            transition: "all 0.2s ease",
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{ height: "100%" }}
                      >
                        <Grid
                          item
                          xs={1}
                          sx={{ display: { xs: "none", md: "block" } }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                          >
                            {index + 1}
                          </Typography>
                        </Grid>
                        <Grid item xs={2} sm={1}>
                          <Avatar
                            variant="square"
                            src={track.img}
                            sx={{
                              width: 45,
                              height: 45,
                              borderRadius: "4px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                        </Grid>

                        <Grid item xs={5}>
                          <ListItemText
                            primary={track.name}
                            secondary={track.artists}
                            primaryTypographyProps={{
                              variant: "body1",
                              sx: {
                                fontSize: 16,
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              },
                            }}
                            secondaryTypographyProps={{
                              variant: "body2",
                              sx: {
                                color: "text.secondary",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              },
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={3}
                          sx={{ display: { xs: "none", md: "block" } }}
                        >
                          <ListItemText
                            secondary={track.album || ""}
                            secondaryTypographyProps={{
                              variant: "body2",
                              sx: {
                                color: "text.secondary",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <Typography variant="body2" color="text.secondary">
                            {track.duration_ms
                              ? formatDuration(track.duration_ms)
                              : ""}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ) : (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center"
                sx={{ 
                  py: 5, 
                  px: 3,
                  textAlign: 'center', 
                  maxWidth: '700px',
                  mx: 'auto'
                }}
              >
                <Box sx={{ maxWidth: 260, mb: 3 }}>
                  <img src="/sailboat.svg" alt="Sailboat" style={{ width: '100%', height: 'auto' }} />
                </Box>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Add your songs here
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                  Use the search bar above to find them.
                </Typography>
              </Box>
            )}
          </CenterBox>
        </Box>
      )}

      {/* Search Dialog */}
      <Dialog
        open={searchOpen}
        onClose={handleSearchClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: { xxs: "90%", sm: "1000px" },
            borderRadius: "20px",
            padding: { xxs: 2, sm: 4 },
            position: "absolute",
            top: { xxs: "100px", sm: "127px" },
            maxHeight: "calc(100vh - 150px)",
            overflow: "auto",
          },
        }}
      >
        <Box sx={{ width: "100%", p: { xxs: 1, sm: 2 } }}>
          <TextField
            inputRef={searchInputRef}
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs... (type at least 3 characters)"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <IconButton disabled={searching}>
                  {searching ? (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          border: "2px solid",
                          borderColor: "grey.300",
                          borderRadius: "50%",
                          borderRightColor: "transparent",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    </Box>
                  ) : (
                    <SearchIcon />
                  )}
                </IconButton>
              ),
              sx: {
                borderRadius: "16px",
                pr: 1,
              },
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused": {
                  boxShadow: "0 0 0 3px rgba(64,126,160,0.1)",
                },
              },
            }}
          />
        </Box>

        <Box sx={{ width: "100%", height: "1px", bgcolor: "divider", mb: 3 }} />

        {searchResult &&
        searchResult.tracks &&
        searchResult.tracks.items &&
        searchResult.tracks.items.length > 0 ? (
          <List sx={{ width: "100%" }}>
            {searchResult.tracks.items.map((track) => {
              const formattedTrack = formatTrack(track);
              return (
                <ListItem
                  key={track.id}
                  sx={{
                    py: 1.5,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                  onClick={() => addTrack(formattedTrack)}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2} sm={1}>
                      <Avatar
                        variant="square"
                        src={formattedTrack.img}
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "4px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </Grid>
                    <Grid item xs={10} sm={11}>
                      <ListItemText
                        primary={formattedTrack.name}
                        secondary={`${formattedTrack.artists} • ${formattedTrack.album}`}
                        primaryTypographyProps={{
                          variant: "body1",
                          sx: {
                            fontSize: 16,
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                        secondaryTypographyProps={{
                          variant: "body2",
                          sx: {
                            color: "text.secondary",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
        ) : searching ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Searching...</Typography>
          </Box>
        ) : searchResult ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No results found. Try a different search term.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              Search for songs to add to your list
            </Typography>
          </Box>
        )}
      </Dialog>
    </ThemeProvider>
  );
}
