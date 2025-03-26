import { useState, useEffect } from "react";
import baseUrl from "../../utils/urlPrefix";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";

import Navbar from "../components/navbar";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  Button,
  Container,
  TextField,
  Stack,
  Divider,
  InputAdornment,
  FormControl,
  Input,
  InputLabel,
  IconButton,
  Box,
  DialogTitle,
  Dialog,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import { ParallaxProvider } from "react-scroll-parallax";
import { Parallax } from "react-scroll-parallax";

import { Link } from "react-router-dom";

import { useParallax } from "react-scroll-parallax";

import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";

import SessionCard from "../components/sessionCard";

import CenterBox from "../components/base/centerBox";
import TopContainer from "../components/base/topContainer";
import BottomContainer from "../components/base/bottomContainer";
import SearchBar from "../components/searchBar";
import TestDialog from "../components/joinSessionDialog";

export default function Test() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'rgba(249, 250, 252, 1)', minHeight: '100vh' }}>
        <Navbar></Navbar>
        <TopContainer>
        <Box sx={{ pt: 2, pb: 3 }}>
          <Box sx={{ 
            display: 'inline-block', 
            position: 'relative',
            mb: 3,
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '12px',
              bottom: '2px',
              left: 0,
              backgroundColor: 'rgba(93, 74, 156, 0.2)',
              zIndex: -1,
              borderRadius: '4px'
            }
          }}>
            <Typography variant="h4" fontWeight="500" sx={{ letterSpacing: '-0.5px' }}>
              Your Sessions
            </Typography>
          </Box>
          <Grid container spacing={3} alignItems="center">
            <Grid item xxs={12} sm={6}>
              <SearchBar />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: { xxs: "none", sm: "flex" } }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ 
                    borderRadius: '12px',
                    px: 3,
                    fontWeight: 500
                  }}
                >
                  New Session
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleClickOpen}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    color: "white",
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(93,74,156,0.25)'
                  }}
                >
                  Join Session
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </TopContainer>
      <Box sx={{ mb: "120px", mt: 4 }}>
        <CenterBox maxWidth="1200px" p={2}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3
            }}>
              <Box 
                sx={{ 
                  width: '8px', 
                  height: '28px', 
                  bgcolor: 'secondary.main', 
                  borderRadius: '4px',
                  mr: 2,
                  boxShadow: '0 2px 8px rgba(93,74,156,0.3)'
                }} 
              />
              <Typography 
                variant="h5" 
                fontWeight="500" 
                sx={{ letterSpacing: '-0.3px' }}
              >
                Recent
              </Typography>
            </Box>
            
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: '16px', 
              p: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid rgba(93,74,156,0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '4px',
                width: '100%',
                background: 'linear-gradient(90deg, rgba(93,74,156,0.7) 0%, rgba(93,74,156,0.3) 100%)',
              }
            }}>
              <Grid
                container
                direction="row"
                justifyContent={{ xxs: "center", twocard: "flex-start" }}
                alignItems="stretch"
                spacing={4}
              >
                <Grid item>
                  <SessionCard></SessionCard>
                </Grid>
                <Grid item>
                  <SessionCard></SessionCard>
                </Grid>
              </Grid>
            </Box>
          </Box>
          
          <Box 
            sx={{
              mb: 4,
              mx: 'auto',
              height: '1px',
              width: '100%',
              maxWidth: '500px',
              background: 'linear-gradient(90deg, rgba(93,74,156,0) 0%, rgba(93,74,156,0.5) 50%, rgba(93,74,156,0) 100%)',
            }}
          />
          
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3
            }}>
              <Box 
                sx={{ 
                  width: '8px', 
                  height: '28px', 
                  bgcolor: 'primary.main', 
                  borderRadius: '4px',
                  mr: 2,
                  boxShadow: '0 2px 8px rgba(64,126,160,0.3)'
                }} 
              />
              <Typography 
                variant="h5" 
                fontWeight="500" 
                sx={{ letterSpacing: '-0.3px' }}
              >
                All Sessions
              </Typography>
            </Box>
            
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: '16px', 
              p: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid rgba(64,126,160,0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '4px',
                width: '100%',
                background: 'linear-gradient(90deg, rgba(64,126,160,0.7) 0%, rgba(64,126,160,0.3) 100%)',
              }
            }}>
              <Grid
                container
                direction="row"
                justifyContent={{ xxs: "center", twocard: "flex-start" }}
                alignItems="stretch"
                spacing={4}
              >
                <Grid item>
                  <SessionCard></SessionCard>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CenterBox>
      </Box>
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2, 
        bgcolor: 'background.paper', 
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', 
        display: { xs: 'flex', sm: 'none' },
        justifyContent: 'center',
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
        borderTop: '1px solid rgba(64,126,160,0.1)'
      }}>
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            width: '100%', 
            maxWidth: '400px',
            px: 2
          }}
        >
          <Button 
            variant="outlined" 
            color="primary" 
            fullWidth
            sx={{ 
              borderRadius: '12px',
              py: 1.5
            }}
          >
            New Session
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth
            onClick={handleClickOpen}
            sx={{ 
              borderRadius: '12px',
              py: 1.5,
              color: 'white'
            }}
          >
            Join Session
          </Button>
        </Stack>
      </Box>
      <TestDialog open={open} onClose={handleClose}></TestDialog>
      </Box>
    </ThemeProvider>
  );
}