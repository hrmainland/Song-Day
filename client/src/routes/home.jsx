import { useState, useEffect, useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import { Box, Grid, Typography } from "@mui/material";
import CenterBox from "../components/base/centerBox";
import { useLocation } from 'react-router-dom';

import Navbar from "../components/navbar";
import TopContainer from "../components/base/topContainer";
import JoinSessionDialog from "../components/joinSessionDialog";
import CreateSessionDialog from "../components/createSessionDialog";
import LoginDialog from "../components/loginDialog";
import TermsDialog from "../components/termsDialog";
import PageHeader from "../components/pageHeader";
import HeaderButtons from "../components/headerButtons";
import GamesIndex from "../components/gamesIndex";
import MobileBottomBar from "../components/mobileBottomBar";
import NoSessionsBox from "../components/noSessionsBox";
import { fetchMyGames } from "../../utils/apiCalls";


import { UserContext } from "../context/userProvider";

export default function Home() {
  const location = useLocation();
  const from = location.state?.from;
  const [joinOpen, setJoinOpen] = useState(from === "/home-join");
  const [createOpen, setCreateOpen] = useState(from === "/home-new");
  const [loginDialogOpen, setLoginDialogOpen] = useState(from === "/home-login");
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [hasGames, setHasGames] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);

  // replace location state to prevent dialog from showing on refresh
  window.history.replaceState({}, document.title);

  // Get values from context
  const { userId, hasAcceptedTerms, termsLoading } = useContext(UserContext);

  // Open terms dialog when component mounts if user is logged in but hasn't accepted terms
  useEffect(() => {
    if (userId && !termsLoading && !hasAcceptedTerms) {
      setTermsDialogOpen(true);
    }
  }, [userId, hasAcceptedTerms, termsLoading]);

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
    if (!userId) {
      setHasGames(false);
      setIsLoading(false);
      return;
    }
    checkUserGames();
  }, [userId]);

  // Track which action to perform after terms acceptance
  const [pendingAction, setPendingAction] = useState(null);

  const handleTermsClose = (accepted) => {
    setTermsDialogOpen(false);

    if (accepted) {
      // Terms were accepted, now we can proceed with the pending action
      if (pendingAction === 'join') {
        setJoinOpen(true);
      } else if (pendingAction === 'create') {
        setCreateOpen(true);
      }
      // Reset the pending action
      setPendingAction(null);
    }
  };

  const handleJoinOpen = () => {
    if (!userId) {
      setLoginDialogOpen(true);
      setRedirectTo("/home-join");
      return;
    }

    // Check if terms have been accepted
    if (!hasAcceptedTerms) {
      setPendingAction('join');
      setTermsDialogOpen(true);
      return;
    }

    setJoinOpen(true);
  };

  const handleJoinClose = () => {
    setJoinOpen(false);
    setLoginDialogOpen(false);
  };

  const handleCreateOpen = () => {
    if (!userId) {
      setLoginDialogOpen(true);
      setRedirectTo("/home-new");
      return;
    }

    // Check if terms have been accepted
    if (!hasAcceptedTerms) {
      setPendingAction('create');
      setTermsDialogOpen(true);
      return;
    }

    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
    setLoginDialogOpen(false);
  };
  
  const handleLoginOpen = () => {
    setLoginDialogOpen(true);
  };

  const handleLoginClose = () => {
    setLoginDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'rgba(249, 250, 252, 1)', minHeight: '100vh' }}>
        <Navbar onLoginOpen={handleLoginOpen} />
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
        ) : (hasGames) ? (
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
        <LoginDialog open={loginDialogOpen} onClose={handleLoginClose} redirectTo={redirectTo} />
        <TermsDialog open={termsDialogOpen} onClose={handleTermsClose} />
      </Box>
    </ThemeProvider>
  );
}
