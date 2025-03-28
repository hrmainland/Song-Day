import { Grid, Button, useMediaQuery, useTheme, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

import { ParallaxProvider } from "react-scroll-parallax";
import { Parallax } from "react-scroll-parallax";

import LoginDialog from "../components/loginDialog";

export default function Root() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  const handleLoginOpen = () => {
    setLoginDialogOpen(true);
  };
  
  const handleLoginClose = () => {
    setLoginDialogOpen(false);
  };
  
  return (
    <ParallaxProvider>
      {/* <Box>
        <img src="/island-trees.svg" alt="trees" />
      </Box> */}
      {isMobile ? (
        // Mobile view - no parallax effect
        <div className="home-background">
          <Grid container spacing={4} justifyContent={"center"}>
            <Grid item xs={12} textAlign={"center"}>
              <h1 className="heading">Song Day</h1>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button
                variant="outlined"
                component={Link}
                to="/home"
                sx={{
                  textTransform: "none",
                  color: "white",
                  borderColor: "lightslategray",
                  "&:hover": {
                    borderColor: "white",
                  },
                  fontSize: "1.1rem",
                  padding: "10px 24px",
                }}
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </div>
      ) : (
        // Desktop view - with parallax effect
        <Parallax speed={-60}>
          <div className="home-background">
            <Parallax speed={50}>
              <Grid container spacing={6} justifyContent={"center"}>
                <Grid item xs={12} textAlign={"center"}>
                  <h1 className="heading">Song Day</h1>
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/home"
                    sx={{
                      textTransform: "none",
                      color: "white",
                      borderColor: "lightslategray",
                      "&:hover": {
                        borderColor: "white",
                      },
                      fontSize: "1.1rem",
                    }}
                  >
                    Get Started
                  </Button>
                </Grid>
              </Grid>
            </Parallax>
          </div>
        </Parallax>
      )}
      <div className="white-div">
        <br />
        <div className="home-content">
          <h2 className="heading">Welcome to Song Day</h2>
          <p>Create collaborative playlists with friends through a fun voting process!</p>
          
          <h3 className="heading">How It Works:</h3>
          <div className="centered-content">
            <ol>
              <li><strong>Create a Session</strong> - Start a new music session and invite your friends</li>
              <li><strong>Add Songs</strong> - Each participant adds songs from Spotify</li>
              <li><strong>Vote</strong> - Everyone votes on their favorites</li>
              <li><strong>Create Playlist</strong> - The final playlist is created in Spotify based on votes</li>
            </ol>
          </div>
          
          <h3 className="heading">Getting Started:</h3>
          <p>Simply login with your Spotify account to create a new session or join an existing one with a session code.</p>
          
          <div className="home-buttons">
            <Button 
              variant="contained" 
              onClick={handleLoginOpen}
              sx={{
                textTransform: "none",
                margin: "10px",
                fontFamily: "Inria Sans",
              }}
            >
              Login with Spotify
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/join-session"
              sx={{
                textTransform: "none",
                margin: "10px",
                fontFamily: "Inria Sans",
              }}
            >
              Join a Session
            </Button>
          </div>
        </div>
      </div>
      
      {/* Login Dialog */}
      <LoginDialog open={loginDialogOpen} onClose={handleLoginClose} />
    </ParallaxProvider>
  );
}
