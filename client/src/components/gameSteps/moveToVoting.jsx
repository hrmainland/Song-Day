import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CenterBox from "../base/centerBox";
import { fetchGame } from "../../../utils/apiCalls";

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

  function submittedNames(){
    return [...nameMap.keys()]
    .filter((id) => submitterIds.includes(id))
    .map((id) => nameMap.get(id));
  }

  function unSubmittedNames(){
    return [...nameMap.keys()]
    .filter((id) => !submitterIds.includes(id))
    .map((id) => nameMap.get(id));
  }
  
  // Shared player list component
  const PlayerList = ({ 
    names, 
    emptyMessage, 
    bgColorHover, 
    dotColor, 
    title 
  }) => {
    return (
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="subtitle1"
          color="text.primary"
          fontWeight="700"
          sx={{ 
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 0.8,
          }}
        >
          <Box component="span" 
            sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: "50%", 
              bgcolor: dotColor,
              display: "inline-block",
              mr: 0.8
            }} 
          />
          {title} ({names.length})
        </Typography>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
          }}
        >
          <List
            sx={{
              bgcolor: "background.paper",
              maxHeight: "200px",
              overflow: "auto",
              p: 0,
            }}
          >
            {names.map((name, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  dense
                  sx={{
                    transition: "background-color 0.2s",
                    "&:hover": {
                      bgcolor: bgColorHover,
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: name === game.hostName ? "primary.main" : "rgba(0, 0, 0, 0.08)",
                      width: 36,
                      height: 36,
                      mr: 1.5,
                      boxShadow: name === game.hostName ? "0 2px 5px rgba(25, 118, 210, 0.3)" : "none",
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={name === game.hostName ? 600 : 400}
                      >
                        {name}{" "}
                        {name === game.hostName && userId === game.host ? 
                          <Typography component="span" 
                            variant="caption" 
                            sx={{ 
                              ml: 0.5, 
                              bgcolor: "primary.main", 
                              color: "white", 
                              px: 0.8, 
                              py: 0.2, 
                              borderRadius: 5,
                              fontSize: "0.65rem",
                            }}
                          >
                            You
                          </Typography> : ""
                        }
                      </Typography>
                    }
                  />
                </ListItem>
                {index < names.length - 1 && (
                  <Divider component="li" variant="inset" />
                )}
              </React.Fragment>
            ))}
            {names.length === 0 && (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography 
                      variant="body2" 
                      color={emptyMessage.color || "text.secondary"} 
                      fontWeight={emptyMessage.fontWeight || 400}
                      sx={{ py: 1 }}
                    >
                      {emptyMessage.text}
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    );
  };

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
          <Paper
            elevation={1}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: "16px",
              background: "linear-gradient(145deg, #ffffff, #f0f7ff)",
              mb: 3.5,
              position: "relative",
              overflow: "hidden",
            }}
          >


            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
              }}
            >
            <Typography 
              variant="h6" 
              sx={{ 
                color: "primary.main",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <PersonIcon /> Who's added their songs
            </Typography>
              <Typography 
                variant="h6" 
                fontWeight="700" 
                color="primary.main"
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 0.5,
                  px: 2,
                  py: 0.5,
                  borderRadius: "20px",
                  bgcolor: "rgba(25, 118, 210, 0.1)",
                }}
              >
                {participantCount} <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>of</Typography> {expectedParticipants}
              </Typography>
            </Box>

            <Box sx={{ mb: 3.5, position: "relative", pt: 0.5 }}>
              <Box
                sx={{
                  height: "12px",
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                  borderRadius: "6px",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${
                      (participantCount / Math.max(expectedParticipants, 1)) *
                      100
                    }%`,
                    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                    borderRadius: "6px",
                    transition: "width 0.5s ease-in-out",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3, opacity: 0.7 }} />

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
              <PlayerList 
                names={submittedNames()}
                title="Submitted Players"
                dotColor="success.main"
                bgColorHover="rgba(25, 118, 210, 0.04)"
                emptyMessage={{
                  text: "No players have submitted yet",
                  color: "text.secondary",
                  fontWeight: 400
                }}
              />
              
              <PlayerList 
                names={unSubmittedNames()}
                title="Waiting on Players"
                dotColor="warning.main"
                bgColorHover="rgba(255, 152, 0, 0.04)"
                emptyMessage={{
                  text: "All players have submitted",
                  color: "success.main",
                  fontWeight: 500
                }}
              />
            </Box>
          </Paper>

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
              <ArrowForwardIcon sx={{ mr: 1 }} /> Moving to Voting Phase
            </Typography>

            <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
              Moving to the voting phase will:
            </Typography>

            <Box 
              component="ul" 
              sx={{ 
                pl: 2, 
                mt: 0,
                listStyleType: "none",
              }}
            >
              {[
                "Close submissions for all players",
                "Open the voting interface for all players",
                "Allow players to vote on each other's songs"
              ].map((item, index) => (
                <Typography 
                  key={index}
                  component="li" 
                  variant="body2" 
                  sx={{ 
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    "&::before": {
                      content: '""',
                      display: "inline-block",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      bgcolor: "warning.main",
                      mr: 1.5,
                      ml: -2,
                    }
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>

            {expectedParticipants > 0 &&
              participantCount < expectedParticipants && (
                <Box
                  sx={{
                    mt: 2.5,
                    p: 2,
                    borderRadius: "10px",
                    bgcolor: "rgba(255, 152, 0, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "warning.main",
                      display: "inline-block",
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="warning.dark"
                    fontWeight={500}
                  >
                    Waiting for {expectedParticipants - participantCount} more
                    player{expectedParticipants - participantCount !== 1 ? "s" : ""} to submit tracks.
                  </Typography>
                </Box>
              )}
          </Paper>

        </Box>
      </CenterBox>
    </Box>
  );
}
