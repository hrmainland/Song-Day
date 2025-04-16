import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import CenterBox from "../base/centerBox";
import PlayerProgressPaper from "../playerProgressPaper";
import MovePhasePaper from "../movePhasePaper";
import CreatePlaylistDialog from "./createPlaylistDialog";
import { UserContext } from "../../context/userProvider";
import { useGame } from "../../hooks/useGame";

export default function CreatePlaylist({
  playlistId,
  handleCreatePlaylist,
}) {
  const { game, refreshGame, loading, gameError } = useGame();
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
    const refreshInterval = setInterval(() => refreshGame(game.gameCode), 10000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [loading, error]);

  useEffect(() => {
    // Get voters - players who have voted on tracks
    if (game) {
      setVoterIds(game.voteGroups.map((voteGroup) => voteGroup.player));
      // console.log('voterIds :>> ', voterIds);
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

        {isHost && (
          <MovePhasePaper
            onButtonClick={() => setDialogOpen(true)}
            title="Ready to create the playlist?"
            text="Click to create your playlist with all the best songs"
            buttonText="Create Playlist"
            color="success"
            bgColor="#f0fff0"
          />
        )}

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

        {!playlistId ? (
          null // Removed the button as we're using the MovePhasePaper instead
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
          <Typography
            variant="body2"
            sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
          >
            Only the session host can create the playlist
          </Typography>
        )}
      </CenterBox>
    </Box>
  );
}