import { useState, useEffect } from "react";
import baseUrl from "../../utils/urlPrefix";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";

import TopContainer from "../components/topContainer";
import Navbar from "../components/navbar";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Button, Container, TextField, Stack, Divider } from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import { ParallaxProvider } from "react-scroll-parallax";
import { Parallax } from "react-scroll-parallax";

import { Link } from "react-router-dom";

import { useParallax } from "react-scroll-parallax";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

import SessionCard from "../components/sessionCard";

const Component = () => {
  const { ref } = useParallax({ speed: 10 });
  return (
    <div
      ref={ref}
      className="my-thing"
      style={{ backgroundColor: "red", width: "60%", height: "60vh" }}
    >
      test
    </div>
  );
};

const SlowComponent = () => {
  const { ref } = useParallax({ speed: 2 });
  return (
    <div
      ref={ref}
      className="my-thing"
      style={{ backgroundColor: "blue", width: "100%", height: "100vh" }}
    >
      test
    </div>
  );
};

const Heading = () => {
  const { ref } = useParallax({ speed: 10 });
};

export default function Test() {
  return (
    <ThemeProvider theme={theme}>
      <Navbar></Navbar>
      <TopContainer>
        <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
          {" "}
          Your Sessions
        </Typography>
        <TextField
          size="small"
          placeholder="Search"
          sx={{ marginBottom: "1rem" }}
        ></TextField>
        <IconButton type="submit" aria-label="search">
          <SearchIcon style={{ fill: "blue" }} />
        </IconButton>
      </TopContainer>

      <Box
        sx={{
          maxWidth: "1000px",
          marginLeft: "auto",
          marginRight: "auto",
          p: 2,
        }}
      >
        <Typography gutterBottom variant="h6">
          Recent
        </Typography>
        <Box
          sx={{
            maxWidth: "950px",
            marginLeft: "auto",
            marginRight: "auto",
            p: 1,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent={{ xxs: "center", xs: "left"}}
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
        </Box>
        <br />
        <Divider />
        <br />
        <Typography gutterBottom gutterTop variant="h6">
          All
        </Typography>
        <Box
          sx={{
            maxWidth: "950px",
            marginLeft: "auto",
            marginRight: "auto",
            p: 1,
          }}
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
            <Grid item>
              <SessionCard></SessionCard>
            </Grid>
            <Grid item>
              <SessionCard></SessionCard>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
