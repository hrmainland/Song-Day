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
  IconButton,
  Tabs,
  Tab
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuIcon from '@mui/icons-material/Menu';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import baseUrl from "../../utils/urlPrefix";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import CenterBox from "../components/base/centerBox";
import TopContainer from "../components/base/topContainer";
import GameCodeDialog from "../components/gameCodeDialog";
import GameStepper from "../components/gameStepper";

// Import game step components
import AddSongs from "../components/gameSteps/addSongs";
import MoveToVoting from "../components/gameSteps/moveToVoting";
import VoteSongs from "../components/gameSteps/voteSongs";
import CreatePlaylist from "../components/gameSteps/createPlaylist";
import PageHeader from "../components/pageHeader";

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
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [copySuccess, setCopySuccess] = useState(false);
  
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

  // MoveToVoting state
  const [trackGroups, setTrackGroups] = useState([]);
  const [movingToVotingPhase, setMovingToVotingPhase] = useState(false);
  
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
          // If user has submitted both tracks and votes, go to playlist step for host only
          if (gameData.host === userId) {
            setActiveStep(2); // Go to playlist creation step for host
          } else {
            setActiveStep(1); // Keep non-hosts at voting step with submitted view
          }
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
    // If user is not the host, they can only advance to step 1
    const maxStep = game.host === userId ? 2 : 1;
    setActiveStep((prevStep) => Math.min(prevStep + 1, maxStep));
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
    if (tracksResponse.length === 0) {
      setSessionOptions([]);
      setOptions([]);
      return;
    }
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

  // ========= MoveToVoting Functions =========
  
  // Fetch track groups for the game
  useEffect(() => {
    const fetchTrackGroups = async () => {
      if (game && game._id && game.host === userId && activeStep === 1) {
        try {
          // We'll simulate fetching track groups here - in a real app, you'd make an API call
          // This is just a placeholder to show the concept
          const groups = game.trackGroups || [];
          setTrackGroups(groups);
        } catch (error) {
          console.error("Error fetching track groups:", error);
        }
      }
    };
    
    fetchTrackGroups();
  }, [game, userId, activeStep]);
  
  const handleMoveToVotingPhase = async () => {
    if (!game || !game._id || game.host !== userId) return;
    
    try {
      setMovingToVotingPhase(true);
      
      // Simulate an API call to update the game phase
      // In a real app, you'd make an actual API call here
      // await updateGamePhase(game._id, 'voting');
      
      // For this demo, we'll just wait a moment and then move to the next step
      setTimeout(() => {
        setMovingToVotingPhase(false);
        setAlertMsg("Session moved to voting phase successfully!");
        setAlertOpen(true);
        handleNext();
      }, 1500);
    } catch (error) {
      console.error("Error moving to voting phase:", error);
      setMovingToVotingPhase(false);
    }
  };
  
  // ========= CreatePlaylist Functions =========
  
  const handleCreatePlaylist = async () => {
    const incomingPlaylistId = await createPlaylist(game._id);
    setPlaylistId(incomingPlaylistId);
    setAlertMsg("Spotify playlist created successfully! Ready to listen.");
    setAlertOpen(true);
  };
  
  // Menu handlers
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    // Reset copy success state after a short delay
    setTimeout(() => {
      setCopySuccess(false);
    }, 1500);
  };
  
  const handleCopyGameCode = () => {
    navigator.clipboard.writeText(gameCode)
      .then(() => {
        setCopySuccess(true);
        // Show alert message
        setAlertMsg("Game code copied to clipboard!");
        setAlertOpen(true);
        
        // Close menu after a short delay
        setTimeout(() => {
          handleMenuClose();
        }, 1000);
      })
      .catch(err => {
        console.error('Failed to copy game code: ', err);
      });
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
    // Non-host users have a different step sequence than host users
    const isHost = game.host === userId;

    switch (step) {
      case 0:
        // Add Songs step (same for both host and non-host)
        return (
          <AddSongs 
            myTracksSubmitted={myTracksSubmitted}
            addedTracks={addedTracks}
            trackLimit={trackLimit}
            handleSearchOpen={handleSearchOpen}
            searchOpen={searchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searching={searching}
            searchResult={searchResult}
            removeTrackFromSession={removeTrackFromSession}
            handleSearchClose={handleSearchClose}
            formatTrack={formatTrack}
            addTrack={addTrack}
            handleSearch={handleSearch}
          />
        );

      case 1:
        // For hosts: Move to Voting step
        // For non-hosts: Vote Songs step
        if (isHost) {
          return (
            <MoveToVoting
              game={game}
              userId={userId}
              trackGroups={trackGroups}
              handleMoveToVotingPhase={handleMoveToVotingPhase}
              movingToVotingPhase={movingToVotingPhase}
            />
          );
        } else {
          return (
            <VoteSongs
              myVotesSubmitted={myVotesSubmitted}
              addView={addView}
              setAddView={setAddView}
              getSessionOptions={getSessionOptions}
              addTrackToShortlist={addTrackToShortlist}
              getSessionShortlist={getSessionShortlist}
              shortlistToOptions={shortlistToOptions}
              submitVotes={submitVotes}
              voteLimit={voteLimit}
              onDragEnd={onDragEnd}
            />
          );
        }

      case 2:
        // For hosts: Vote Songs step
        // For non-hosts: This would not be accessible
        if (isHost) {
          return (
            <VoteSongs
              myVotesSubmitted={myVotesSubmitted}
              addView={addView}
              setAddView={setAddView}
              getSessionOptions={getSessionOptions}
              addTrackToShortlist={addTrackToShortlist}
              getSessionShortlist={getSessionShortlist}
              shortlistToOptions={shortlistToOptions}
              submitVotes={submitVotes}
              voteLimit={voteLimit}
              onDragEnd={onDragEnd}
            />
          );
        }
        return <Typography>Not authorized</Typography>;

      case 3:
        // Create Playlist step (host only)
        if (isHost) {
          return (
            <CreatePlaylist
              game={game}
              userId={userId}
              playlistId={playlistId}
              handleCreatePlaylist={handleCreatePlaylist}
            />
          );
        }
        return <Typography>Not authorized</Typography>;

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              component={Link} 
              to={`/home`}
              sx={{ 
                mr: 2,
                borderRadius: '50%',
                minWidth: '40px',
                width: '35px',
                height: '35px',
                p: 0
              }}
            >
              <ArrowBackIcon />
            </Button>
            <Box>
              <PageHeader title={game.title} />
            </Box>
          </Box>
          
          {/* Hamburger Menu */}
          <Box>
            <IconButton
              onClick={handleMenuOpen}
              aria-controls={menuOpen ? "game-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
              sx={{ 
                color: 'primary.main',
                ml: 2
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Menu Dropdown */}
            <Menu
              id="game-menu"
              anchorEl={menuAnchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  mt: 1,
                }
              }}
            >
              <MenuItem sx={{ minWidth: '200px', py: 2 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Game Code
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="500">
                      {gameCode}
                    </Typography>
                    <IconButton 
                      onClick={handleCopyGameCode}
                      color={copySuccess ? "success" : "primary"}
                      size="small"
                    >
                      {copySuccess ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                </Box>
              </MenuItem>
            </Menu>
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
              color="success" 
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
      <CenterBox maxWidth="800px" sx={{ mb: 3 }}>
        <GameStepper
          activeStep={activeStep}
          handleBack={handleBack}
          handleNext={handleNext}
          submitTracks={submitTracks}
          submitVotes={submitVotes}
          addedTracks={addedTracks}
          trackLimit={trackLimit}
          myTracksSubmitted={myTracksSubmitted}
          getSessionShortlist={getSessionShortlist}
          voteLimit={voteLimit}
          myVotesSubmitted={myVotesSubmitted}
          addView={addView}
          game={game}
          userId={userId}
        />
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
    </ThemeProvider>
  );
}