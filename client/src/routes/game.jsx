/* eslint-disable no-undef */
import { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
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
import HostStepper from "../components/hostStepper";
import GuestStepper from "../components/guestStepper";
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
import { createPlaylist } from "../../utils/apiCalls";

import { myTrackGroup, myVoteGroup, gameStatus } from "../../utils/gameUtils";

export default function Game() {
  const { userId, accessToken, tokenLoading } = useContext(UserContext);
  const { game, refreshGame, loading, gameError, isHost } = useGame();

  const location = useLocation();
  const { gameCode } = useParams();

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

  // Alert state - for success messages
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // Game state
  const [gameName, setGameName] = useState("");
  const [myTracksSubmitted, setMyTracksSubmitted] = useState(false);
  const [trackLimit, setTrackLimit] = useState(null);

  // Game Phase state
  const [voteLimit, setVoteLimit] = useState(null);
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
      if (game.host !== userId) {
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
    };

    processGameData();
  }, [game]);

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

  const getMainContent = () => {
    if (isHost) {
      if (game.status === gameStatus.add && !myTracksSubmitted) {
        return <AddSongs />;
      } else if (game.status === gameStatus.add && myTracksSubmitted) {
        return <MoveToVoting />;
      } else if (game.status === gameStatus.vote && !myVotesSubmitted) {
        return <VoteSongs />;
      } else if (game.status === gameStatus.vote) {
        return (
          <CreatePlaylist
            playlistId={playlistId}
            handleCreatePlaylist={handleCreatePlaylist}
          />
        );
      }
      return <h1>other</h1>;
    } else if (!isHost) {
      if (game.status === gameStatus.add && !myTracksSubmitted) {
        return <AddSongs />;
      } else if (game.status === gameStatus.add && myTracksSubmitted) {
        return <h1>Put Your Feet Up</h1>;
      } else if (game.status === gameStatus.vote && !myVotesSubmitted) {
        return <VoteSongs />;
      } else if (game.status === gameStatus.vote && myVotesSubmitted) {
        return <h1>Awaiting Playlist Creation</h1>;
      } else if (game.status === gameStatus.completed) {
        return <h1>Playlist Created</h1>;
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

      {getMainContent()}

      {/* Stepper and Navigation Box */}
      <CenterBox maxWidth="1000px">
        {isHost ? (
          <HostStepper
            myTracksSubmitted={myTracksSubmitted}
            myVotesSubmitted={myVotesSubmitted}
          />
        ) : (
          <GuestStepper
            myTracksSubmitted={myTracksSubmitted}
            myVotesSubmitted={myVotesSubmitted}
          />
        )}
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
            }
          }}
        />
      )}

      {/* Success Alert */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
