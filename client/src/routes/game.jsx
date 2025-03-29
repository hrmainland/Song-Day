/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Grid, 
  Alert, 
  Paper, 
  Stepper,
  Step,
  StepLabel,
  IconButton
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import baseUrl from "../../utils/urlPrefix";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import CenterBox from "../components/base/centerBox";
import TopContainer from "../components/base/topContainer";
import GameCodeDialog from "../components/gameCodeDialog";

// Import components for AddSongs
import AddedTracksList from "../components/trackDisplays/addedTracksList";
import SearchDialog from "../components/trackDisplays/searchDialog";
import EmptyTracksView from "../components/trackDisplays/emptyTracksView";
import SearchBar from "../components/trackDisplays/searchBar";
import SubmittedView from "../components/trackDisplays/submittedView";

// Import components for VoteSongs
import ShortlistDisplay from "../components/trackDisplays/shortlistDisplay";
import OptionsDisplay from "../components/trackDisplays/optionsDisplay";
import { DragDropContext } from "react-beautiful-dnd";

// Import API functions
import { 
  fetchMe, 
  fetchGame, 
  addSessionTracks,
  addTrackGroupToGame,
  getMyTrackGroup,
  getAllVotableTracks,
  newVoteGroup,
  getMyVoteGroup,
  addVoteGroupToGame,
  createPlaylist
} from "../../utils/apiCalls";

// Import utility functions
import { searchTracks, getMultipleTracksById } from "../../utils/spotifyCalls";
import { artistString, usefulTrackComponents } from "../../utils/spotifyApiUtils";

const STEPS = ['Add Songs', 'Vote on Songs', 'Create Playlist'];

export default function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameCode } = useParams();
  
  // General state
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState();
  const [accessToken, setAccessToken] = useState(null);
  const [alertOpen, setAlertOpen] = useState(!!location.state?.alertMsg);
  const [alertMsg, setAlertMsg] = useState(location.state?.alertMsg || "Success!");
  const [activeStep, setActiveStep] = useState(0);
  
  // GameCodeDialog state
  const [showGameCodeDialog, setShowGameCodeDialog] = useState(location.state?.showGameCodeDialog || false);

  // AddSongs state
  const TRACK_KEY = `${gameCode}: tracks`;
  const [myTracksSubmitted, setMyTracksSubmitted] = useState(false);
  const [trackLimit, setTrackLimit] = useState(null);
  const [gameName, setGameName] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [addedTracks, setAddedTracks] = useState([]);

  // VoteSongs state
  const OPTIONS_KEY = `${gameCode}: options`;
  const SHORTLIST_KEY = `${gameCode}: shortlist`;
  const [initialIds, setInitialIds] = useState([]);
  const [voteLimit, setVoteLimit] = useState(null);
  const [options, setOptions] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [addView, setAddView] = useState(true);
  const [myVotesSubmitted, setMyVotesSubmitted] = useState(false);

  // CreatePlaylist state
  const [playlistId, setPlaylistId] = useState(null);

  // Initialize component
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchMe();
        setUserId(userData._id);
        setAccessToken(userData.access_token);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameData = await fetchGame(gameCode);
        setGame(gameData);
        setGameName(gameData.title);
        setTrackLimit(gameData.config.nSongs);
        setVoteLimit(gameData.config.nVotes);
        
        // Check user's state for each step
        // Step 1: Adding songs
        const trackGroup = await getMyTrackGroup(gameData._id);
        const isTracksSubmitted = Boolean(trackGroup);
        setMyTracksSubmitted(isTracksSubmitted);
        
        // Step 2: Voting
        const voteGroup = await getMyVoteGroup(gameData._id);
        const isVotesSubmitted = Boolean(voteGroup);
        setMyVotesSubmitted(isVotesSubmitted);
        
        // Load tracks from local storage for AddSongs
        const storedTracks = getSessionTracks();
        setAddedTracks(storedTracks);

        // If user has already submitted tracks and not voted, start at voting step
        if (isTracksSubmitted && !isVotesSubmitted) {
          setActiveStep(1);
        } else if (isTracksSubmitted && isVotesSubmitted) {
          // If user has submitted both tracks and votes, go to playlist step for host,
          // or back to step 0 for non-host users (they'll see the submitted view)
          setActiveStep(gameData.host === userId ? 2 : 0);
        }

        // VoteSongs initialization
        if (accessToken) {
          fetchAndSetIds(gameData);
          const sessionShortlist = getSessionShortlist();
          if (sessionShortlist.length === 0 && accessToken) {
            setOptionsFromDb(gameData);
          } else {
            setOptions(getSessionOptions());
            setShortlist(getSessionShortlist());
          }
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (accessToken) {
      fetchGameData();
    }
  }, [gameCode, accessToken, userId]);

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, 2));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  // ========= AddSongs Functions =========
  
  // Search dialog handlers
  const handleSearchOpen = () => {
    setSearchOpen(true);
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

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim().length >= 3) {
      performSearch(searchQuery);
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

  // Add track to user's list
  const addTrack = (track) => {
    if (trackLimit && addedTracks.length >= trackLimit) {
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

  // Submit tracks to session
  const submitTracks = async () => {
    try {
      const storedTracks = getSessionTracks();

      if (storedTracks.length < trackLimit) {
        return;
      }

      const trackGroup = await addSessionTracks(storedTracks);
      await addTrackGroupToGame(game._id, trackGroup._id);

      // Clear local storage
      localStorage.removeItem(TRACK_KEY);
      
      // Update state
      setMyTracksSubmitted(true);
      
      // Show success message
      setAlertMsg("Songs submitted successfully! Ready to vote next.");
      setAlertOpen(true);
      
      // Move to next step
      handleNext();
    } catch (error) {
      console.error("Error submitting tracks:", error);
    }
  };

  // ========= VoteSongs Functions =========
  
  const fetchAndSetIds = async (gameData) => {
    const trackIds = await getAllVotableTracks(gameData._id);
    setInitialIds(trackIds);
  };

  const setOptionsFromDb = async (gameData) => {
    const tracksResponse = await getAllVotableTracks(gameData._id);
    const SpotifyTracks = await getMultipleTracksById(accessToken, tracksResponse);
    const trackObjects = SpotifyTracks.map((trackId) => {
      return usefulTrackComponents(trackId);
    });
    setSessionOptions(trackObjects);
    setOptions(trackObjects);
  };

  const getSessionArray = (sessionKey) => {
    let raw = localStorage.getItem(sessionKey);
    try {
      const result = JSON.parse(raw);
      if (!result) {
        return [];
      }
      return result;
    } catch {
      return [];
    }
  };

  const setSessionArray = (sessionKey, data) => {
    localStorage.setItem(sessionKey, JSON.stringify(data));
  };

  const getSessionOptions = () => getSessionArray(OPTIONS_KEY);
  const getSessionShortlist = () => getSessionArray(SHORTLIST_KEY);

  const setSessionOptions = (data) => setSessionArray(OPTIONS_KEY, data);
  const setSessionShortlist = (data) => setSessionArray(SHORTLIST_KEY, data);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    // session
    const sessionShortlist = getSessionShortlist();
    const [updatedSessionShortlist] = sessionShortlist.splice(
      result.source.index,
      1
    );
    sessionShortlist.splice(
      result.destination.index,
      0,
      updatedSessionShortlist
    );
    setSessionShortlist(sessionShortlist);

    // state
    setShortlist(sessionShortlist);
  };

  const removeOption = (index) => {
    // local storage
    const sessionOptions = getSessionOptions();
    sessionOptions.splice(index, 1);
    setSessionOptions(sessionOptions);

    // state
    setOptions(sessionOptions);
  };

  const removeShortlist = (index) => {
    // local storage
    const sessionShortlist = getSessionShortlist();
    sessionShortlist.splice(index, 1);
    setSessionShortlist(sessionShortlist);

    // state
    setShortlist(sessionShortlist);
  };

  const addTrackToShortlist = (track, index) => {
    if (voteLimit - getSessionShortlist().length) {
      // remove track from option
      removeOption(index);

      // local storage
      const sessionShortlist = getSessionShortlist();
      sessionShortlist.push(track);
      setSessionShortlist(sessionShortlist);

      // state
      setShortlist(sessionShortlist);
    }
  };

  const shortlistToOptions = (track, shortlistIndex) => {
    // remove track from shortlist
    removeShortlist(shortlistIndex);

    var removedCount = 0;
    const sessionShortlist = getSessionShortlist();
    const shortlistSet = new Set(sessionShortlist.map((track) => track.id));
    var optionsIndex;
    for (let i = 0; i < initialIds.length; i++) {
      if (initialIds[i] === track.id) {
        optionsIndex = i - removedCount;
      }
      if (shortlistSet.has(initialIds[i])) removedCount++;
    }

    // local storage
    const sessionOptions = getSessionOptions();
    sessionOptions.splice(optionsIndex, 0, track);
    setSessionOptions(sessionOptions);

    // state
    setOptions(sessionOptions);
  };

  const submitVotes = async () => {
    const sessionShortlist = getSessionShortlist();
    var items = [];
    for (let [index, track] of sessionShortlist.entries()) {
      const item = { trackId: track.id, vote: index };
      items.push(item);
    }

    const voteGroup = await newVoteGroup(game._id, items);
    await addVoteGroupToGame(game._id, voteGroup._id);

    // Update state
    setMyVotesSubmitted(true);
    
    // Show success message
    setAlertMsg("Votes submitted successfully! Your ranking has been saved.");
    setAlertOpen(true);
    
    // Move to next step
    handleNext();
  };

  // ========= CreatePlaylist Functions =========
  
  const handleCreatePlaylist = async () => {
    const incomingPlaylistId = await createPlaylist(game._id);
    setPlaylistId(incomingPlaylistId);
    setAlertMsg("Spotify playlist created successfully! Ready to listen.");
    setAlertOpen(true);
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <CenterBox maxWidth="800px" p={3} sx={{ mt: 5 }}>
          <Typography color="error" variant="body1">Error: {error}</Typography>
        </CenterBox>
      </ThemeProvider>
    );
  }

  // If no game data
  if (!game) {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <CenterBox maxWidth="800px" p={3} sx={{ mt: 5 }}>
          <Typography variant="body1">No session data available.</Typography>
        </CenterBox>
      </ThemeProvider>
    );
  }

  // Render the appropriate step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        // Add Songs step
        return myTracksSubmitted ? (
          <SubmittedView />
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

                <SearchBar onClick={handleSearchOpen} />
              </Box>

              {addedTracks.length > 0 ? (
                <AddedTracksList 
                  tracks={addedTracks} 
                  onRemoveTrack={removeTrackFromSession} 
                />
              ) : (
                <EmptyTracksView />
              )}
            </CenterBox>
          </Box>
        );

      case 1:
        // Vote Songs step
        return myVotesSubmitted ? (
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
              You've already submitted your votes
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              Your votes have been recorded. Check back later to see the final playlist.
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
              <Grid container>
                <Grid item xs={12} display="flex" justifyContent="center" marginY={2}>
                  {addView ? (
                    <Button 
                      onClick={() => setAddView(false)} 
                      variant="contained"
                      sx={{ borderRadius: "12px" }}
                    >
                      Go To Shortlist ({shortlist.length})
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setAddView(true)} 
                      variant="outlined"
                      sx={{ borderRadius: "12px" }}
                    >
                      Back To Options
                    </Button>
                  )}
                </Grid>
              </Grid>

              <Box
                display="flex"
                justifyContent="center"
                sx={{
                  display: addView ? "flex" : "none",
                }}
              >
                <OptionsDisplay
                  tracks={getSessionOptions()}
                  addFunc={addTrackToShortlist}
                  missingTracks={voteLimit - getSessionShortlist().length}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                sx={{
                  display: addView ? "none" : "flex",
                }}
              >
                <DragDropContext onDragEnd={onDragEnd}>
                  <ShortlistDisplay
                    tracks={getSessionShortlist()}
                    removeFunc={shortlistToOptions}
                    submitFunc={submitVotes}
                    missingTracks={voteLimit - getSessionShortlist().length}
                  />
                </DragDropContext>
              </Box>
            </CenterBox>
          </Box>
        );

      case 2:
        // Create Playlist step
        return (
          <Box sx={{ mt: 2, mb: 4 }}>
            <CenterBox
              maxWidth="1000px"
              p={3}
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h5" fontWeight="500" sx={{ mb: 3, textAlign: "center" }}>
                Create Playlist
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
                There are {game.voteGroups?.length || 0} sets of votes submitted
              </Typography>
              
              {!playlistId ? (
                <Box display="flex" justifyContent="center">
                  <Button 
                    onClick={handleCreatePlaylist}
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ borderRadius: "12px", px: 4, py: 1.2 }}
                    disabled={!game.host || game.host !== userId}
                  >
                    Create Playlist
                  </Button>
                </Box>
              ) : (
                <Box sx={{ mt: 3 }}>
                  <iframe
                    style={{ borderRadius: "12px" }}
                    src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
                    width="100%"
                    height="352"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </Box>
              )}
              
              {game.host !== userId && (
                <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
                  Only the session host can create the playlist
                </Typography>
              )}
            </CenterBox>
          </Box>
        );

      default:
        return (
          <Typography>Unknown step</Typography>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      
      <TopContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button 
            component={Link} 
            to={`/home`}
            sx={{ 
              mr: 2,
              borderRadius: '50%',
              minWidth: '40px',
              width: '40px',
              height: '40px',
              p: 0
            }}
          >
            <ArrowBackIcon />
          </Button>
          <Box>
            <Typography 
              variant="h5" 
              fontWeight={600} 
              sx={{ letterSpacing: '-0.3px' }}
            >
              {game.title}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight="400"
            >
              Session Code: {gameCode}
            </Typography>
          </Box>
        </Box>
      </TopContainer>

      {alertOpen && (
        <Box sx={{ 
          position: 'fixed', 
          top: '72px', 
          left: 0, 
          right: 0, 
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Paper 
            elevation={4} 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              px: 2.5, 
              py: 1.5, 
              borderRadius: '12px',
              bgcolor: 'success.light',
              maxWidth: '80%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: 'success.main',
            }}
          >
            <CheckIcon 
              fontSize="small" 
              sx={{ 
                color: 'success.main',
                mr: 1.5
              }} 
            />
            <Typography 
              variant="body1" 
              color="success.dark" 
              fontWeight={500}
              sx={{ mr: 2 }}
            >
              {alertMsg}
            </Typography>
            <IconButton 
              size="small" 
              edge="end" 
              sx={{ 
                color: 'success.dark',
                p: 0,
                ml: 1,
              }}
              onClick={() => setAlertOpen(false)}
            >
              <Box 
                component="span" 
                sx={{ 
                  fontSize: '1.2rem',
                  lineHeight: 1,
                  fontWeight: 'bold',
                }}>
                ×
              </Box>
            </IconButton>
          </Paper>
        </Box>
      )}

      {getStepContent(activeStep)}

      {/* Stepper and Navigation Box */}
      <CenterBox maxWidth="800px" sx={{ mb: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid rgba(64,126,160,0.1)',
          }}
        >
          {/* Stepper Component */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {STEPS.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Navigation description */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            textAlign="center" 
            sx={{ mb: 3 }}
          >
            {activeStep === 0 && !myTracksSubmitted && (
              `Add ${trackLimit} songs to your list, then submit them to continue.`
            )}
            {activeStep === 0 && myTracksSubmitted && (
              "You've already submitted your songs. Continue to the next step to vote."
            )}
            {activeStep === 1 && !myVotesSubmitted && (
              `Select ${voteLimit} songs from the options and rank them in order of preference.`
            )}
            {activeStep === 1 && myVotesSubmitted && (
              "You've already submitted your votes. Continue to see the playlist."
            )}
            {activeStep === 2 && game.host === userId && (
              "Create a Spotify playlist with the top-voted songs."
            )}
            {activeStep === 2 && game.host !== userId && (
              "The session host will create the final playlist."
            )}
          </Typography>
          
          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ 
                mr: 1, 
                borderRadius: '12px',
                px: 3,
                py: 1.2
              }}
            >
              Back
            </Button>
            
            {activeStep === 0 && !myTracksSubmitted && (
              <Button
                variant="contained"
                color="primary"
                onClick={submitTracks}
                disabled={addedTracks.length < trackLimit}
                sx={{ 
                  borderRadius: '12px',
                  px: 3,
                  py: 1.2
                }}
              >
                Submit Tracks
              </Button>
            )}
            
            {activeStep === 1 && !myVotesSubmitted && !addView && (
              <Button
                variant="contained"
                color="primary"
                onClick={submitVotes}
                disabled={getSessionShortlist().length < voteLimit}
                sx={{ 
                  borderRadius: '12px',
                  px: 3,
                  py: 1.2
                }}
              >
                Submit Votes
              </Button>
            )}
            
            {((activeStep === 0 && myTracksSubmitted) || 
              (activeStep === 1 && myVotesSubmitted) ||
              (activeStep === 1 && addView)) && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ 
                  borderRadius: '12px',
                  px: 3,
                  py: 1.2
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </CenterBox>
      
      {/* Game Code Success Dialog */}
      {game && (
        <GameCodeDialog 
          open={showGameCodeDialog}
          onClose={() => setShowGameCodeDialog(false)}
          gameCode={gameCode}
          gameName={game.title}
        />
      )}
      
      {/* Search Dialog for AddSongs */}
      <SearchDialog
        open={searchOpen}
        onClose={handleSearchClose}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searching={searching}
        searchResult={searchResult}
        onAddTrack={addTrack}
        formatTrack={formatTrack}
        onSearch={handleSearch}
      />
    </ThemeProvider>
  );
}