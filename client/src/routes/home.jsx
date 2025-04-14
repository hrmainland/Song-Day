import { useState, useEffect, useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import { Box, Grid, Typography } from "@mui/material";
import CenterBox from "../components/base/centerBox";

import Navbar from "../components/navbar";
import TopContainer from "../components/base/topContainer";
import JoinSessionDialog from "../components/joinSessionDialog";
import CreateSessionDialog from "../components/createSessionDialog";
import PageHeader from "../components/pageHeader";
import HeaderButtons from "../components/headerButtons";
import GamesIndex from "../components/gamesIndex";
import MobileBottomBar from "../components/mobileBottomBar";
import NoSessionsBox from "../components/noSessionsBox";
import { fetchMyGames } from "../../utils/apiCalls";


import { UserProvider, UserContext } from "../context/userProvider";

export default function Home() {
  const [joinOpen, setJoinOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [hasGames, setHasGames] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserGames = async () => {
      try {
        const games = await fetchMyGames();
        setHasGames(games && games.length > 0);
        setGames(games);
      } catch (error) {
        console.error("Error fetching games:", error);
        setHasGames(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserGames();
  }, []);

  const handleJoinOpen = () => {
    setJoinOpen(true);
  };

  const handleJoinClose = () => {
    setJoinOpen(false);
  };
  
  const handleCreateOpen = () => {
    setCreateOpen(true);
  };
  
  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'rgba(249, 250, 252, 1)', minHeight: '100vh' }}>
        <Navbar />
        <TopContainer sx={{ py: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <PageHeader title="Your Sessions" />
            </Grid>
            
            {hasGames && (
              <>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ 
                    display: { xs: "none", sm: "flex" },
                    justifyContent: "flex-end"
                  }}
                >
                  <HeaderButtons 
                    onCreateClick={handleCreateOpen} 
                    onJoinClick={handleJoinOpen} 
                  />
                </Grid>
              </>
            )}
          </Grid>
        </TopContainer>
        
        {isLoading ? (
          <CenterBox maxWidth="1200px" p={2}>
            <Typography variant="body1">Loading...</Typography>
          </CenterBox>
        ) : hasGames ? (
          <>
            
            <Box sx={{ mb: "120px", mt: 2 }}>
              <GamesIndex 
              myGames={games}
              />
            </Box>

            <MobileBottomBar 
              onCreateClick={handleCreateOpen}
              onJoinClick={handleJoinOpen}
            />
          </>
        ) : (
          <NoSessionsBox 
            onCreateClick={handleCreateOpen}
            onJoinClick={handleJoinOpen}
          />
        )}

        <JoinSessionDialog open={joinOpen} onClose={handleJoinClose} />
        <CreateSessionDialog open={createOpen} onClose={handleCreateClose} /> 
      </Box>
    </ThemeProvider>
  );
}
