/* eslint-disable no-undef */
import { Box, Button, Typography, Container, Grid, Alert, Paper } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import baseUrl from "../../utils/urlPrefix";
import { useParams, useLocation, Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import { fetchGame, fetchMe } from "../../utils/apiCalls";
import CenterBox from "../components/base/centerBox";
import TopContainer from "../components/base/topContainer";
import GameCodeDialog from "../components/gameCodeDialog";

export default function Game() {
  const location = useLocation();
  const { gameCode } = useParams();
  const [game, setGame] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState();
  const [alertOpen, setAlertOpen] = useState(!!location.state?.alertMsg);
  const [alertMsg, setAlertMsg] = useState(
    location.state?.alertMsg || "Success!"
  );
  
  // GameCodeDialog state
  const [showGameCodeDialog, setShowGameCodeDialog] = useState(location.state?.showGameCodeDialog || false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchMe();
        setUserId(data._id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchGameAndSet = async () => {
      try {
        const data = await fetchGame(gameCode);
        setGame(data);
      } catch (error) {
        console.error("Error fetching game data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGameAndSet();
  }, [gameCode]);

  if (loading) {
    return (
      <>
        <Navbar />
        <CenterBox maxWidth="800px" p={3} sx={{ mt: 5 }}>
          <Typography variant="body1">Loading session...</Typography>
        </CenterBox>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <CenterBox maxWidth="800px" p={3} sx={{ mt: 5 }}>
          <Typography color="error" variant="body1">Error: {error}</Typography>
        </CenterBox>
      </>
    );
  }

  if (!game) {
    return (
      <>
        <Navbar />
        <CenterBox maxWidth="800px" p={3} sx={{ mt: 5 }}>
          <Typography variant="body1">No session data available.</Typography>
        </CenterBox>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <TopContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button 
            component={Link} 
            to={`/home`}
            sx={{ 
              mr: 2,
              borderRadius: '50%',
              minWidth: '40px',
              width: '40px',
              height: '40px',
              p: 0
            }}
          >
            <ArrowBackIcon />
          </Button>
          <Typography 
            variant="h5" 
            fontWeight={600} 
            sx={{ letterSpacing: '-0.3px' }}
          >
            Session Details
          </Typography>
        </Box>
      </TopContainer>

      {alertOpen && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          onClose={() => {
            setAlertOpen(false);
          }}
          sx={{ mx: 2, mb: 2 }}
        >
          {alertMsg}
        </Alert>
      )}

      <CenterBox maxWidth="800px" p={3}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid rgba(64,126,160,0.1)',
            mb: 4
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom
              fontWeight={600}
              sx={{ color: 'primary.main' }}
            >
              {game.title}
            </Typography>
            
            <Box sx={{ 
              display: 'inline-block',
              bgcolor: 'rgba(64,126,160,0.07)',
              px: 2,
              py: 1,
              borderRadius: '8px',
              mb: 3
            }}>
              <Typography 
                variant="subtitle1" 
                fontWeight={500}
                sx={{ color: 'primary.dark' }}
              >
                Session Code: {gameCode}
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              paragraph
              color="text.secondary"
            >
              Select an action below to continue with this session:
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                component={Link}
                to={`/session/${gameCode}/add-songs`}
                size="large"
                sx={{ 
                  borderRadius: '12px',
                  py: 1.5,
                  boxShadow: '0 4px 12px rgba(64,126,160,0.25)',
                }}
              >
                Add Songs
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                component={Link}
                to={`/session/${gameCode}/vote`}
                size="large"
                sx={{ 
                  borderRadius: '12px',
                  py: 1.5,
                }}
              >
                Vote on Songs
              </Button>
            </Grid>

            {game.host === userId && (
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  component={Link}
                  to={`/session/${gameCode}/create-playlist`}
                  size="large"
                  sx={{ 
                    borderRadius: '12px',
                    py: 1.5,
                  }}
                >
                  Create Playlist
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      </CenterBox>
      
      {/* Game Code Success Dialog */}
      {game && (
        <GameCodeDialog 
          open={showGameCodeDialog}
          onClose={() => setShowGameCodeDialog(false)}
          gameCode={gameCode}
          gameName={game.title}
        />
      )}
    </>
  );
}
