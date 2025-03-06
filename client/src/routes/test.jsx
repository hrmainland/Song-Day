import { useState, useEffect } from "react";
import baseUrl from "../../utils/urlPrefix";

import Navbar from "../components/navbar";

import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


export default function Test() {
  return (
    <>
    <Navbar></Navbar>

<Box
      sx={{
        width: "100%", // Shrinks the box on small screens
        padding: { xs: "8px", sm: "16px" }, // Optional: adjust padding
        backgroundColor: "lightgray",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "20px", sm: "24px" }, // Smaller text on small screens
          textAlign: "center",
        }}
      >
        Responsive Text
      </Typography>
    </Box>

    </>
  )
}



