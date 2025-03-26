import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import { Box, Grid } from "@mui/material";

import Navbar from "../components/navbar";
import TopContainer from "../components/base/topContainer";
import SearchBar from "../components/searchBar";
import JoinSessionDialog from "../components/joinSessionDialog";
import CreateSessionDialog from "../components/createSessionDialog";
import PageHeader from "../components/pageHeader";
import HeaderButtons from "../components/headerButtons";
import GamesIndex from "../components/gamesIndex";
import MobileBottomBar from "../components/mobileBottomBar";

export default function Home() {
  const [joinOpen, setJoinOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

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
            <Grid item xxs={12} sm={4}>
              <PageHeader title="Your Sessions" />
            </Grid>
            
            <Grid item xxs={12} sm={4}>
              <SearchBar />
            </Grid>

            <Grid
              item
              xxs={12}
              sm={4}
              sx={{ 
                display: { xxs: "none", sm: "flex" },
                justifyContent: "flex-end"
              }}
            >
              <HeaderButtons 
                onCreateClick={handleCreateOpen} 
                onJoinClick={handleJoinOpen} 
              />
            </Grid>
          </Grid>
        </TopContainer>
        
        <Box sx={{ mb: "120px", mt: 2 }}>
          <GamesIndex />
        </Box>

        <MobileBottomBar 
          onCreateClick={handleCreateOpen}
          onJoinClick={handleJoinOpen}
        />

        <JoinSessionDialog open={joinOpen} onClose={handleJoinClose} />
        <CreateSessionDialog open={createOpen} onClose={handleCreateClose} />
      </Box>
    </ThemeProvider>
  );
}
