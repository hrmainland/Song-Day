import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import CenterBox from "../base/centerBox";
import PlayerProgressPaper from "../playerProgressPaper";
import MovePhasePaper from "../movePhasePaper";
import CreatePlaylistDialog from "./createPlaylistDialog";
import { UserContext } from "../../context/userProvider";
import { useGame } from "../../hooks/useGame";

export default function CreatePlaylist({ handleCreatePlaylist }) {
  const { isHost, game, refreshGame, loading, gameError } = useGame();
  const gameCode = game?.gameCode;
  const { userId } = useContext(UserContext);
  const [voterIds, setVoterIds] = useState([]);
  const [nameMap, setNameMap] = useState(new Map());
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch game data
  useEffect(() => {
    if (!game) return;
    refreshGame(game.gameCode);

    // Set up interval to refresh data every 10 seconds
    const refreshInterval = setInterval(
      () => refreshGame(game.gameCode),
      10000
    );

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    // Get voters - players who have voted on tracks
    if (game) {
      setVoterIds(game.voteGroups.map((voteGroup) => voteGroup.player));
      for (let player of game.players) {
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
  if (gameError) {
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
  const participantCount = game.voteGroups.length || 0;
  const expectedParticipants = game.players?.length || 0;

  return (
    <Box sx={{ mt: 1.5, mb: 3 }}>
      <CenterBox
        maxWidth="1000px"
        p={{ xs: 2, sm: 2.5 }}
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="500"
          sx={{ mb: 3, textAlign: "left" }}
        >
          Create Playlist
        </Typography>


          <PlayerProgressPaper
            title="Who's voted"
            nameMap={nameMap}
            submitterIds={voterIds}
            userId={userId}
            hostId={game.host}
          />

            <MovePhasePaper
              onButtonClick={() => setDialogOpen(true)}
              title="Ready to create the playlist?"
              text="Click to create your playlist with all the best songs"
              buttonText="Create Playlist"
              color="success"
              bgColor="#f0fff0"
            />

        {/* Dialog for confirming playlist creation */}
        <CreatePlaylistDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onProceed={() => {
            setDialogOpen(false);
            handleCreatePlaylist();
          }}
          participantCount={participantCount}
          expectedParticipants={expectedParticipants}
        />
      </CenterBox>
    </Box>
  );
}
