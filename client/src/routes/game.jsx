/* eslint-disable no-undef */
import { useState, useEffect, useContext } from "react";
import { Box, Button, Typography, IconButton, Tooltip } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";

import Navbar from "../components/navbar";
import CenterBox from "../components/base/centerBox";
import TopContainer from "../components/base/topContainer";
import GameCodeDialog from "../components/gameCodeDialog";
import GameStepper from "../components/gameStepper";
import DisplayNameDialog from "../components/displayNameDialog";

// Import game step components
import AddSongs from "../components/gameSteps/addSongs";
import MoveToVoting from "../components/gameSteps/moveToVoting";
import VoteSongs from "../components/gameSteps/voteSongs";
import CreatePlaylist from "../components/gameSteps/createPlaylist";
import PageHeader from "../components/pageHeader";

import { UserContext } from "../context/userProvider";
import { useGame } from "../hooks/useGame";

// Import API functions
import {
  addSessionTracks,
  addTrackGroupToGame,
  newVoteGroup,
  addVoteGroupToGame,
  createPlaylist,
} from "../../utils/apiCalls";

import {
  votableTracks,
  myTrackGroup,
  myVoteGroup,
} from "../../utils/gameUtils";

// Import utility functions
import { searchTracks, getMultipleTracksById } from "../../utils/spotifyCalls";
import {
  artistString,
  usefulTrackComponents,
} from "../../utils/spotifyApiUtils";

const gameStatus = Object.freeze({
  add: "add",
  vote: "vote",
  completed: "completed",
});

export default function Game() {
  const { userId, accessToken, tokenLoading } = useContext(UserContext);
  const { game, refreshGame, loading, gameError, isHost } = useGame();

  const location = useLocation();
  const { gameCode } = useParams();

  // General state
  const [activeStep, setActiveStep] = useState(0);

  // GameCodeDialog state
  const [showGameCodeDialog, setShowGameCodeDialog] = useState(
    location.state?.showGameCodeDialog || false
  );

  // DisplayNameDialog state
  const [showDisplayNameDialog, setShowDisplayNameDialog] = useState(false);
  const [needsDisplayName, setNeedsDisplayName] = useState(false);

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

  // CreatePlaylist state
  const [playlistId, setPlaylistId] = useState(null);

  useEffect(() => {
    const pullGame = async () => {
      await refreshGame(gameCode);
    };
    if (!gameError) {
      pullGame();
    }
  }, []);

  useEffect(() => {
    const processGameData = async () => {
      if (!game) {
        return;
      }

      // Using game data from context
      setGameName(game.title);
      setTrackLimit(game.config.nSongs);
      setVoteLimit(game.config.nVotes);

      // Check if user needs to set a display name (only for non-hosts)
      if (!game.host === userId) {
        // Find the current user in the players array
        const currentPlayer = game.players.find((player) => {
          if (typeof player.user === "object") {
            return player.user._id === userId;
          }
          return player.user === userId;
        });

        // If the current player exists and doesn't have a display name, show the dialog
        if (currentPlayer && !currentPlayer.displayName) {
          setNeedsDisplayName(true);
          setShowDisplayNameDialog(true);
        }
      }

      // Check user's state for each step
      // Step 1: Adding songs
      const trackGroup = myTrackGroup(game, userId);
      const isTracksSubmitted = Boolean(trackGroup);
      setMyTracksSubmitted(isTracksSubmitted);

      // Step 2: Voting
      const voteGroup = myVoteGroup(game, userId);
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
        if (isHost) {
          setActiveStep(2); // Go to playlist creation step for host
        } else {
          setActiveStep(1); // Keep non-hosts at voting step with submitted view
        }
      }

      // VoteSongs initialization
      fetchAndSetIds(game);
      const sessionShortlist = getSessionShortlist();
      if (sessionShortlist.length === 0) {
        setOptionsFromDb(game);
      } else {
        setOptions(getSessionOptions());
        setShortlist(getSessionShortlist());
      }
    };

    processGameData();
  }, [game]);

  const handleNext = () => {
    // If user is not the host, they can only advance to step 1
    const maxStep = game.host === userId ? 3 : 1;
    setActiveStep((prevStep) => Math.min(prevStep + 1, maxStep));

    // Game data is managed by the context provider, no need to refresh it here
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
    // const trackIds = await getAllVotableTracks(gameData._id);
    const trackIds = votableTracks(gameData, userId);
    setInitialIds(trackIds);
  };

  const setOptionsFromDb = async (gameData) => {
    // const tracksResponse = await getAllVotableTracks(gameData._id);
    const tracksResponse = votableTracks(gameData, userId);
    if (tracksResponse.length === 0) {
      setSessionOptions([]);
      setOptions([]);
      return;
    }
    const SpotifyTracks = await getMultipleTracksById(
      accessToken,
      tracksResponse
    );
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
    navigator.clipboard
      .writeText(gameCode)
      .then(() => {
        setCopySuccess(true);

        // Close menu after a short delay
        setTimeout(() => {
          handleMenuClose();
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy game code: ", err);
      });
  };

  // Loading state
  if (loading || tokenLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "80vh",
          }}
        >
          <Typography variant="h6">
            {tokenLoading
              ? "Retrieving Spotify access..."
              : "Loading game data..."}
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // Error state
  if (gameError) {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <CenterBox maxWidth="800px" p={3} sx={{ mt: 5 }}>
          <Typography variant="h5">No Session Found</Typography>
          <Typography variant="body1">
            It looks like the session you're looking for doesn't exist or you're
            not a part of it.
          </Typography>
        </CenterBox>
      </ThemeProvider>
    );
  }

  // If no game data from context
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
  // const getStepContent = (step) => {
  //   // Non-host users have a different step sequence than host users

  //   switch (step) {
  //     case 0:
  //       // Add Songs step (same for both host and non-host)
  //       return (
  //         <AddSongs
  //           myTracksSubmitted={myTracksSubmitted}
  //           addedTracks={addedTracks}
  //           trackLimit={trackLimit}
  //           handleSearchOpen={handleSearchOpen}
  //           searchOpen={searchOpen}
  //           searchQuery={searchQuery}
  //           setSearchQuery={setSearchQuery}
  //           searching={searching}
  //           searchResult={searchResult}
  //           removeTrackFromSession={removeTrackFromSession}
  //           handleSearchClose={handleSearchClose}
  //           formatTrack={formatTrack}
  //           addTrack={addTrack}
  //           handleSearch={handleSearch}
  //         />
  //       );

  //     case 1:
  //       // For hosts: Move to Voting step
  //       // For non-hosts: Vote Songs step
  //       if (isHost) {
  //         return (
  //           <MoveToVoting/>
  //         );
  //       } else {
  //         return (
  //           <VoteSongs
  //             myVotesSubmitted={myVotesSubmitted}
  //             addView={addView}
  //             setAddView={setAddView}
  //             getSessionOptions={getSessionOptions}
  //             addTrackToShortlist={addTrackToShortlist}
  //             getSessionShortlist={getSessionShortlist}
  //             shortlistToOptions={shortlistToOptions}
  //             submitVotes={submitVotes}
  //             voteLimit={voteLimit}
  //             onDragEnd={onDragEnd}
  //           />
  //         );
  //       }

  //     case 2:
  //       // For hosts: Vote Songs step
  //       // For non-hosts: This would not be accessible
  //       if (isHost) {
  //         return (
  //           <VoteSongs
  //             myVotesSubmitted={myVotesSubmitted}
  //             addView={addView}
  //             setAddView={setAddView}
  //             getSessionOptions={getSessionOptions}
  //             addTrackToShortlist={addTrackToShortlist}
  //             getSessionShortlist={getSessionShortlist}
  //             shortlistToOptions={shortlistToOptions}
  //             submitVotes={submitVotes}
  //             voteLimit={voteLimit}
  //             onDragEnd={onDragEnd}
  //           />
  //         );
  //       }
  //       return <Typography>Not authorized</Typography>;

  //     case 3:
  //       // Create Playlist step (host only)
  //       if (isHost) {
  //         return (
  //           <CreatePlaylist
  //             playlistId={playlistId}
  //             handleCreatePlaylist={handleCreatePlaylist}
  //           />
  //         );
  //       }
  //       return <Typography>Not authorized</Typography>;

  //     default:
  //       return <Typography>Unknown step</Typography>;
  //   }
  // };

  const getStepContent = (step) => {
    if (isHost) {
      if (game.status === gameStatus.add && !myTracksSubmitted) {
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
      } else if (game.status === gameStatus.add && myTracksSubmitted) {
        return <MoveToVoting />;
      } else if (game.status === gameStatus.vote && !myVotesSubmitted) {
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
      } else if (game.status === gameStatus.vote) {
        return (
          <CreatePlaylist
            playlistId={playlistId}
            handleCreatePlaylist={handleCreatePlaylist}
          />
        );
      }
      return <h1>other</h1>;
    }


    else if (!isHost){
      if (game.status === gameStatus.add && !myTracksSubmitted) {
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
      } else if (game.status === gameStatus.add && myTracksSubmitted) {
        return (<h1>Put Your Feet Up</h1>);
      } else if (game.status === gameStatus.vote && !myVotesSubmitted) {
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
      } else if (game.status === gameStatus.vote) {
        return (<h1>Playlist Created</h1>);
      }
      return <h1>other</h1>;
    }
    };

  return (
    <ThemeProvider theme={theme}>
      <Navbar />

      <TopContainer>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              component={Link}
              to={`/home`}
              sx={{
                mr: 2,
                borderRadius: "50%",
                minWidth: "40px",
                width: "35px",
                height: "35px",
                p: 0,
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
                color: "primary.main",
                ml: 2,
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
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  mt: 1,
                },
              }}
            >
              <MenuItem sx={{ minWidth: "220px", py: 1.5 }}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Game Code
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "8px",
                      p: 1,
                      pl: 1.5,
                      bgcolor: "rgba(0, 0, 0, 0.02)",
                      "&:hover": {
                        bgcolor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      letterSpacing="0.5px"
                    >
                      {gameCode}
                    </Typography>
                    <Tooltip title={copySuccess ? "Copied!" : "Copy game code"}>
                      <IconButton
                        onClick={handleCopyGameCode}
                        color={copySuccess ? "success" : "primary"}
                        size="small"
                        sx={{
                          ml: 1,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: copySuccess
                              ? "success.light"
                              : "primary.light",
                            color: "#fff",
                          },
                        }}
                      >
                        {copySuccess ? (
                          <CheckIcon fontSize="small" />
                        ) : (
                          <ContentCopyIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </TopContainer>

      {getStepContent(activeStep)}

      {/* Stepper and Navigation Box */}
      <CenterBox maxWidth="800px">
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
        />
      </CenterBox>

      {/* Game Code Success Dialog */}
      {game && (
        <GameCodeDialog
          open={showGameCodeDialog}
          onClose={() => {
            setShowGameCodeDialog(false);
            // Update location.state to prevent dialog from showing on refresh
            if (location.state) {
              const newState = { ...location.state, showGameCodeDialog: false };
              window.history.replaceState(newState, document.title);
            }
          }}
        />
      )}

      {/* Display Name Dialog */}
      {game && needsDisplayName && (
        <DisplayNameDialog
          open={showDisplayNameDialog}
          onClose={(displayName) => {
            setShowDisplayNameDialog(false);

            // If a displayName was returned, the user submitted the form successfully
            if (displayName) {
              setNeedsDisplayName(false);

              // Show success message
              setAlertMsg("Display name set successfully!");
              setAlertOpen(true);

              refreshGame(gameCode);
              // // Refresh the game data to update the display name in the UI
              // const updatedGame = { ...game };
              // const playerIndex = updatedGame.players.findIndex((player) => {
              //   if (typeof player.user === "object") {
              //     return player.user._id === userId;
              //   }
              //   return player.user === userId;
              // });

              // if (playerIndex !== -1) {
              //   updatedGame.players[playerIndex].displayName = displayName;
              //   setGame(updatedGame);
              // }
            }
          }}
        />
      )}
    </ThemeProvider>
  );
}
