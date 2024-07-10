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

function Template() {
  return (
    <>
      <Navbar></Navbar>
      <Container
        fixed
        className="top-container"
        sx={{
          mt: 5,
        }}
      >
        <Box display="flex" justifyContent="center">
          <Grid container maxWidth={600}>
            <Grid item xs={12}>
              hello
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Template;
