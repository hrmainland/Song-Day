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
      <Navbar></Navbar>
      <TopContainer>
        <Typography variant="h5" gutterBottom>
          {" "}
          Your Sessions
        </Typography>
        <Grid container spacing={2}>
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
                justifyContent: "center",
                alignItems: "center",
                gap: 2, // spacing between buttons
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                sx={{ textTransform: "none", fontWeight: "normal" }}
              >
                New Session
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                sx={{
                  textTransform: "none",
                  fontWeight: "normal",
                  color: "white",
                }}
              >
                Join Session
              </Button>
            </Box>
          </Grid>
        </Grid>
      </TopContainer>
      <Box sx={{ mb: "80px" }}>
        <CenterBox maxWidth="1200px" p={2}>
          <Typography gutterBottom variant="h6">
            Recent
          </Typography>
          <CenterBox maxWidth="1150px" p={1}>
            <Grid
              container
              direction="row"
              justifyContent={{ xxs: "center", twocard: "left" }}
              alignItems="center"
              spacing={4}
            >
              <Grid item>
                <SessionCard></SessionCard>
              </Grid>
              <Grid item>
                <SessionCard></SessionCard>
              </Grid>
            </Grid>
          </CenterBox>
          <br />
          <Divider />
          <br />
          <Typography gutterBottom gutterTop variant="h6">
            All
          </Typography>
          <CenterBox maxWidth="1150px" p={1}>
            <Grid
              container
              direction="row"
              justifyContent={{ xxs: "center", twocard: "left" }}
              alignItems="center"
              spacing={4}
            >
              <Grid item>
                <SessionCard></SessionCard>
              </Grid>
            </Grid>
          </CenterBox>
        </CenterBox>
      </Box>
      <BottomContainer>
        <Stack direction="row" spacing={2}>
          <Button variant="contained">New Session</Button>
          <Button variant="contained">Join Session</Button>
        </Stack>
      </BottomContainer>
      <TestDialog open={open} onClose={handleClose}></TestDialog>
    </ThemeProvider>
  );
}
