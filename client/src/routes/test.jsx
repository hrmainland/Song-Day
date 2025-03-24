import { useState, useEffect } from "react";
import baseUrl from "../../utils/urlPrefix";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";

import Navbar from "../components/navbar";

import Box from "@mui/material/Box";
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

export default function Test() {
  return (
    <ThemeProvider theme={theme}>
      <Navbar></Navbar>
      <TopContainer>
        <Typography variant="h5" gutterBottom>
          {" "}
          Your Sessions
        </Typography>
        <SearchBar/>
      </TopContainer>

      <CenterBox
          maxWidth="1000px"
          p={2}
        >
        <Typography gutterBottom variant="h6">
          Recent
        </Typography>
        <CenterBox
          maxWidth="950px"
          p={1}
        >
          <Grid
            container
            direction="row"
            justifyContent={{ xxs: "center", xs: "left" }}
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
        <CenterBox
        maxWidth="950px"
        p={1}>
          <Grid
            container
            direction="row"
            justifyContent={{ xxs: "center", xs: "left" }}
            alignItems="center"
            spacing={4}
          >
            <Grid item>
              <SessionCard></SessionCard>
            </Grid>
            <Grid item>
              <SessionCard></SessionCard>
            </Grid>
            <Grid item>
              <SessionCard></SessionCard>
            </Grid>
            <Grid item>
              <SessionCard></SessionCard>
            </Grid>
            
          </Grid>
        </CenterBox>
      </CenterBox>
    <BottomContainer>
      <Stack direction="row" spacing={2}>
        <Button variant="contained">New Session</Button>
        <Button variant="contained">Join Session</Button>
      </Stack>
    </BottomContainer>
    </ThemeProvider>
  );
}
