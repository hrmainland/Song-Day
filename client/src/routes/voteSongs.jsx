/* eslint-disable no-undef */
import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import baseUrl from "../../utils/urlPrefix";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

import { addGameToMe, newGame } from "../../utils/apiCalls";

function VoteSongs() {
  return <p>vote songs</p>;
}

export default VoteSongs;
