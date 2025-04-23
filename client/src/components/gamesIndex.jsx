import baseUrl from "../../utils/urlPrefix";
import { Grid, Box, Typography } from "@mui/material";
import SessionCard from "./sessionCard";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import SessionsHeader from "./sessionsHeader";
import SessionsContainer from "./sessionsContainer";
import GradientDivider from "./gradientDivider";
import CenterBox from "./base/centerBox";

export default function GamesIndex({myGames}) {
  const navigate = useNavigate();

  const handleGameClick = (gameCode) => {
    navigate(`/session/${gameCode}`);
  };

  if (!myGames || myGames.length === 0) {
    return (
      <CenterBox maxWidth="1200px" p={2}>
        <Typography variant="body1">No sessions found</Typography>
      </CenterBox>
    );
  }

  // Sort games by creation date (newest first)
  const sortedGames = [...myGames].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Get games created in the last month (maximum of 4)
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const recentGames = sortedGames
    .filter(game => new Date(game.createdAt) >= oneMonthAgo)
    .slice(0, 4);
    
  // Create a set of recent game IDs for fast lookups
  const recentGameIds = new Set(recentGames.map(game => game.gameCode));
  
  // Filter out recent games from the all games list
  const remainingGames = sortedGames.filter(game => !recentGameIds.has(game.gameCode));
  
  // Determine which sections to show
  const hasRecentGames = recentGames.length > 0;
  const hasRemainingGames = remainingGames.length > 0;
  
  return (
    <CenterBox maxWidth="1200px" p={2}>
      {hasRecentGames && (
        <Box sx={{ mb: hasRemainingGames ? 4 : 0 }}>
          <SessionsHeader title="Recent" />
          
          <SessionsContainer borderColor="rgba(93,74,156,0.1)">
            {recentGames.map((game) => (
              <Grid item key={game.gameCode}>
                <SessionCard 
                  game={game} 
                  onClick={() => handleGameClick(game.gameCode)} 
                />
              </Grid>
            ))}
          </SessionsContainer>
        </Box>
      )}
      
      {hasRecentGames && hasRemainingGames && <GradientDivider />}
      
      {hasRemainingGames && (
        <Box>
          <SessionsHeader 
            title="All" 
            color="primary.main" 
            boxShadow="0 2px 8px rgba(64,126,160,0.3)" 
          />
          
          <SessionsContainer borderColor="rgba(64,126,160,0.1)">
            {remainingGames.map((game) => (
              <Grid item key={game.gameCode}>
                <SessionCard 
                  game={game} 
                  onClick={() => handleGameClick(game.gameCode)} 
                />
              </Grid>
            ))}
          </SessionsContainer>
        </Box>
      )}
    </CenterBox>
  );
}
