import { 
  Grid, 
  Button, 
  useMediaQuery, 
  useTheme, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem,
  Avatar,
  Tooltip
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import PersonIcon from '@mui/icons-material/Person';

import { ParallaxProvider } from "react-scroll-parallax";
import { Parallax } from "react-scroll-parallax";

import {UserContext} from "../context/userProvider";

export default function Root() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { userId } = useContext(UserContext);
  
  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Common button styles with responsive adjustments
  const getStartedButtonStyles = {
    textTransform: "none",
    color: "#253238",
    fontSize: "1.1rem",
    fontWeight: 700,
    padding: "10px 28px",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(93, 74, 156, 0.08)",
    border: "1px solid rgba(93, 74, 156, 0.15)",
    transition: "all 0.25s ease",
    letterSpacing: "0.2px",
    "&:hover": {
      backgroundColor: "#F8F9FF",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(93, 74, 156, 0.12)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(93, 74, 156, 0.15)",
    },
  };

  // Hero content component
  const HeroContent = () => (
    <Grid container spacing={isMobile ? 4 : 6} justifyContent={"center"}>
      <Grid item xs={12} textAlign={"center"}>
        <h1 
          className="heading" 
          style={{ 
            textShadow: isMobile ? "0 0 10px rgba(0, 0, 0, 0.5)" : "0 0 10px black", 
            color: "white" 
          }}
        >
          Song Day
        </h1>
      </Grid>
      <Grid item xs={12} textAlign="center">
        <Button
          variant="contained"
          component={Link}
          to="/home"
          sx={getStartedButtonStyles}
        >
          Get Started
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <ParallaxProvider>
      {isMobile ? (
        // Mobile view - no parallax effect
        <div className="home-background">
          <HeroContent />
        </div>
      ) : (
        // Desktop view - with parallax effect
        <Parallax speed={-60}>
          <div className="home-background">
            <Parallax speed={50}>
              <HeroContent />
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
              variant="outlined" 
              component={Link} 
              to="/join-session"
              sx={{
                textTransform: "none",
                margin: "10px",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                fontSize: "1rem",
                padding: "10px 24px",
                borderRadius: "12px",
                borderColor: "rgba(64, 123, 255, 0.5)",
                color: "#407BFF",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#407BFF",
                  backgroundColor: "rgba(64, 123, 255, 0.04)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Join a Session
            </Button>
          </div>
        </div>
      </div>
      
    </ParallaxProvider>
  );
}
