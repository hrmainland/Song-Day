import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import { Box, Grid } from "@mui/material";

import Navbar from "../components/navbar";
import SessionCard from "../components/sessionCard";
import CenterBox from "../components/base/centerBox";
import TopContainer from "../components/base/topContainer";
import SearchBar from "../components/searchBar";
import JoinSessionDialog from "../components/joinSessionDialog";
import CreateSessionDialog from "../components/createSessionDialog";
import SessionsHeader from "../components/sessionsHeader";
import SessionsContainer from "../components/sessionsContainer";
import MobileBottomBar from "../components/mobileBottomBar";
import GradientDivider from "../components/gradientDivider";
import PageHeader from "../components/pageHeader";
import HeaderButtons from "../components/headerButtons";

export default function Test() {
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
          <CenterBox maxWidth="1200px" p={2}>
            <Box sx={{ mb: 4 }}>
              <SessionsHeader title="Recent" />
              
              <SessionsContainer borderColor="rgba(93,74,156,0.1)">
                <Grid item>
                  <SessionCard />
                </Grid>
                <Grid item>
                  <SessionCard />
                </Grid>
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
                <Grid item>
                  <SessionCard />
                </Grid>
              </SessionsContainer>
            </Box>
          </CenterBox>
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