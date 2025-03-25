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
import SearchBarButton from "../components/searchBarButton";
import SearchDialog from "../components/searchDialog";


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
        <Typography variant="h5" gutterBottom>
          Greece Hottest 100
        </Typography>
      </TopContainer>
      <Box sx={{ mb: "80px" }}>
        <CenterBox maxWidth="1000px" p={2}>
          <Typography gutterBottom variant="h6">
            Your List
          </Typography>
          <SearchBarButton onClick={handleClickOpen}></SearchBarButton>
        </CenterBox>
      </Box>
      <SearchDialog open={open} onClose={handleClose}></SearchDialog>
    </ThemeProvider>
  );
}
