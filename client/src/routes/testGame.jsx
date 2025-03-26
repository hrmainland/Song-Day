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
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Paper,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import { ParallaxProvider } from "react-scroll-parallax";
import { Parallax } from "react-scroll-parallax";

import { Link } from "react-router-dom";

import { useParallax } from "react-scroll-parallax";

import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";

import SessionCard from "../components/sessionCard";

import CenterBox from "../components/base/centerBox";
import TopContainer from "../components/base/topContainer";
import BottomContainer from "../components/base/bottomContainer";
import SearchBar from "../components/searchBar";
import SearchBarButton from "../components/searchBarButton";
import SearchDialog from "../components/searchDialog";

import AccessTimeIcon from "@mui/icons-material/AccessTime";

const test_tracks = [
  {
    id: "7ouMYWpwJ422jRcDASZB7P",
    name: "Knights of Cydonia",
    artists: "Muse",
    img: "https://i.scdn.co/image/ab67616d0000485128933b808bfb4cbbd0385400",
  },
  {
    id: "4VqPOruhp5EdPBeR92t6lQ",
    name: "Uprising",
    artists: "Muse",
    img: "https://i.scdn.co/image/ab67616d00004851b6d4566db0d12894a1a3b7a2",
  },
  {
    id: "0EdMqiKs9LKXhspeQhl4RZ",
    name: "Time is Running Out",
    artists: "Muse",
    img: "https://i.scdn.co/image/ab67616d000048518cb690f962092fd44bbe2bf4",
  },
];

export default function TestGame() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar></Navbar>
      <TopContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
          <Typography variant="h5" fontWeight="500" sx={{ letterSpacing: '-0.5px' }}>
            Greece Hottest 100
          </Typography>
          <Button variant="contained" color="primary" size="large" sx={{ borderRadius: '12px' }}>
            Submit Votes
          </Button>
        </Box>
      </TopContainer>
      
      <Box sx={{ my: 4 }}>
        <CenterBox maxWidth="1000px" p={3} sx={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Typography variant="h5" fontWeight="500" sx={{ letterSpacing: '-0.3px' }}>
              Your List
            </Typography>
            <SearchBarButton onClick={handleClickOpen}></SearchBarButton>
          </Box>

          <Paper sx={{ borderRadius: '12px', overflow: 'hidden', mb: 2 }}>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              <ListItem
                sx={{
                  pt: 2,
                  bgcolor: 'rgba(0,0,0,0.02)',
                  borderBottom: '1px solid rgba(0,0,0,0.08)'
                }}
                secondaryAction={
                  <IconButton edge="end" sx={{ mr: 2 }}>
                    <Box sx={{ width: 24, height: 24 }} />
                  </IconButton>
                }
              >
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ height: "100%" }}
                >
                  <Grid item xs={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Typography variant="subtitle2" color="text.secondary" align="center">#</Typography>
                  </Grid>
                  <Grid item xs={2} sm={1}>
                    <Box sx={{ width: 45, display: 'flex', justifyContent: 'center' }} />
                  </Grid>
                  <Grid item xs={5}>
                    <ListItemText
                      secondary="TITLE"
                      secondaryTypographyProps={{ 
                        variant: "caption", 
                        sx: { 
                          color: 'text.secondary',
                          fontWeight: 600,
                          letterSpacing: '0.5px'
                        } 
                      }}
                    />
                  </Grid>
                  <Grid item xs={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <ListItemText
                      secondary="ALBUM"
                      secondaryTypographyProps={{ 
                        variant: "caption", 
                        sx: { 
                          color: 'text.secondary',
                          fontWeight: 600,
                          letterSpacing: '0.5px' 
                        } 
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </Box>
                  </Grid>
                </Grid>
              </ListItem>
              
              {test_tracks.map((track, index) => (
                <ListItem
                  key={track.id}
                  sx={{ 
                    py: 1.5, 
                    transition: 'all 0.2s ease', 
                    '&:hover': { 
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      '& .MuiIconButton-root': { opacity: 1 }
                    },
                    borderBottom: index < test_tracks.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none'
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      sx={{ 
                        color: 'text.secondary', 
                        '&:hover': { color: 'error.main' },
                        opacity: 0,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    sx={{ height: "100%" }}
                  >
                    <Grid item xs={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {index + 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                      <Avatar
                        variant="square"
                        src={track.img}
                        sx={{
                          width: 45,
                          height: 45,
                          borderRadius: "4px",
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Grid>

                    <Grid item xs={5}>
                      <ListItemText
                        primary={track.name}
                        secondary={track.artists}
                        primaryTypographyProps={{
                          variant: "body1",
                          sx: {
                            fontSize: 16,
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          },
                        }}
                        secondaryTypographyProps={{ 
                          variant: "body2",
                          sx: {
                            color: 'text.secondary',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                      <ListItemText
                        secondary="Kiss the Sun"
                        secondaryTypographyProps={{ 
                          variant: "body2",
                          sx: {
                            color: 'text.secondary',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <Typography variant="body2" color="text.secondary">
                        4:06
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          </Paper>
        </CenterBox>
      </Box>
      
      <SearchDialog open={open} onClose={handleClose}></SearchDialog>
    </ThemeProvider>
  );
}
