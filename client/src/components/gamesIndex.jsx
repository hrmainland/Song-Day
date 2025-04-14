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

  // Take the first 2 games which will be the most recent ones
  // since we reversed the array above
  const recentGames = myGames.slice(0, 2);
  
  return (
    <CenterBox maxWidth="1200px" p={2}>
      <Box sx={{ mb: 4 }}>
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
          {recentGames.length === 0 && (
            <Grid item>
              <Typography variant="body2" sx={{ p: 2, color: "text.secondary" }}>
                No recent sessions
              </Typography>
            </Grid>
          )}
        </SessionsContainer>
      </Box>
      
      <GradientDivider />
      
      <Box>
        <SessionsHeader 
          title="All Sessions" 
          color="primary.main" 
          boxShadow="0 2px 8px rgba(64,126,160,0.3)" 
        />
        
        <SessionsContainer borderColor="rgba(64,126,160,0.1)">
          {myGames.map((game) => (
            <Grid item key={game.gameCode}>
              <SessionCard 
                game={game} 
                onClick={() => handleGameClick(game.gameCode)} 
              />
            </Grid>
          ))}
        </SessionsContainer>
      </Box>
    </CenterBox>
  );
}
