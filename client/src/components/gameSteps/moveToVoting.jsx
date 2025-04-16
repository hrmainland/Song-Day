import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Grid,
} from "@mui/material";
import CenterBox from "../base/centerBox";
import MoveToVotingDialog from "./moveToVotingDialog";
import PlayerProgressPaper from "../playerProgressPaper";
import MovePhasePaper from "../movePhasePaper";
import { useGame } from "../../hooks/useGame";
import { UserContext } from "../../context/userProvider";

export default function MoveToVoting({
  handleMoveToVotingPhase,
  movingToVotingPhase,
}) {
  // State for game data
  const { game, refreshGame, loading, error } = useGame();
  const {userId} = useContext(UserContext);
  const [submitterIds, setSubmitterIds] = useState([]);
  const [nameMap, setNameMap] = useState(new Map());
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch game data
  useEffect(() => {
    if (!game) return;
    refreshGame(game.gameCode);

    // Set up interval to refresh data every 10 seconds
    const refreshInterval = setInterval(() => refreshGame(game.gameCode), 10000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [loading, error]);


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
            <MovePhasePaper
              onButtonClick={() => setDialogOpen(true)}
              title="Ready to start voting?"
              text="When you're ready, move to the voting phase to let players vote on each other's songs."
              buttonText="Move to Voting"
              color="warning"
              bgColor="#fff8f0"
            />
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
