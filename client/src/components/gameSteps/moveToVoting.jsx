import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Grid,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CenterBox from "../base/centerBox";
import { fetchGame } from "../../../utils/apiCalls";
import MoveToVotingDialog from "./moveToVotingDialog";
import PlayerProgressPaper from "../playerProgressPaper";

export default function MoveToVoting({
  gameId,
  gameCode,
  userId,
  handleMoveToVotingPhase,
  movingToVotingPhase,
}) {
  // State for game data
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitterIds, setSubmitterIds] = useState([]);
  const [nameMap, setNameMap] = useState(new Map());
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch game data
  useEffect(() => {
    const getGameData = async () => {
      try {
        setLoading(true);
        const gameData = await fetchGame(gameCode);
        setGame(gameData);
      } catch (err) {
        console.error("Error fetching game data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getGameData();

    // Set up interval to refresh data every 10 seconds
    const refreshInterval = setInterval(getGameData, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [gameCode]);


  useEffect(() => {
    // Get submitters - players who have submitted tracks
    if (game) {
      setSubmitterIds(game.trackGroups.map((trackGroup) => trackGroup.player));
      for (let player of game.players){
        nameMap.set(player.user, player.displayName);
      }
      setNameMap(nameMap);
    }
  }, [game]);


  // Show loading state
  if (loading && !game) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading game data: {error}</Typography>
      </Box>
    );
  }

  // If game data hasn't loaded yet
  if (!game) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading game data...</Typography>
      </Box>
    );
  }

  // Only host should access this page
  const isHost = game.host === userId;
  const participantCount = game.trackGroups.length || 0;
  const expectedParticipants = game.players?.length || 0;

  return (
    <Box sx={{ mt: 2}}>
      <CenterBox
        maxWidth="900px"
        p={{ xs: 2.5, sm: 3 }}
        sx={{
          borderRadius: "20px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="500"
          sx={{ 
            mb: 3.5, 
          }}
        >
          Session Status
        </Typography>

        <Box sx={{ mb: 4 }}>
          <PlayerProgressPaper
              title = "Who's added their songs"
              nameMap = {nameMap}
              submitterIds={submitterIds}
              userId = {userId}
              hostId = {game.host}
          />

          {isHost && (
            <Paper
              elevation={1}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: "16px",
                background: "linear-gradient(145deg, #ffffff, #fff8f0)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2.5,
                      color: "warning.dark",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                  Ready to start voting?
                  </Typography>

                  <Typography variant="body1" paragraph>
                    When you're ready, move to the voting phase to let players vote on each other's songs.
                  </Typography>

                </Grid>

                <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    variant="contained"
                    color="warning"
                    sx={{
                      borderRadius: "10px",
                      minWidth: { xs: "100%", sm: "220px" },
                      fontSize: "1rem",
                      py: { xs: 1.5, sm: 1.2 },
                      px: { xs: 3, sm: 2.5 },
                      fontWeight: 600,
                      boxShadow: "0 4px 10px rgba(255, 152, 0, 0.3)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 12px rgba(255, 152, 0, 0.4)",
                      },
                      "&:disabled": {
                        bgcolor: "rgba(0, 0, 0, 0.12)",
                      }
                    }}
                    startIcon={<ArrowForwardIcon />}
                  >
                    Move to Voting
                  </Button>
                </Grid>
              </Grid>
              
            </Paper>
          )}
          
          {/* Dialog for confirming move to voting phase */}
          <MoveToVotingDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onProceed={() => {
              setDialogOpen(false);
              handleMoveToVotingPhase();
            }}
            isProcessing={movingToVotingPhase}
            participantCount={participantCount}
            expectedParticipants={expectedParticipants}
          />

        </Box>
      </CenterBox>
    </Box>
  );
}
