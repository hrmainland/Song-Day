import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack, Chip, Grid, ThemeProvider } from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import theme from "../../utils/theme";


export default function SessionCard() {
  return (
    <ThemeProvider theme={theme}>
      {/* <Card sx={{ width: {xxs: 140, xs: 180 } }}> */}
      <Card sx={{ width: {xxs: 280, xs: 180 } }}>
        <CardMedia
          // sx={{ height: {xxs: 105, xs: 135} }}
          sx={{ height: {xxs: 210, xs: 135} }}
          image="https://images.unsplash.com/photo-1596743887991-4f07d0e823e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          // image="https://mosaic.scdn.co/60/ab67616d00001e022ec0df7877422d06b43739f2ab67616d00001e028051cb5d497c5e49f1548b99ab67616d00001e02fa801a4035231185d97ab1a8ab67616d00001e02ff1a7df76be413eaffda8545"
        />
        <CardContent>
          <Typography
            variant="caption"
            gutterBottom
            sx={{ display: "block", color: "blue" }}
          >
            4 Feb 2024
          </Typography>
          <Typography variant="h3"
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              mb: 2
            }}>
            Greece Hottest 100
          </Typography>
          <Stack direction="row" spacing={2}>
            <Chip icon={<PersonOutlineIcon />} label="8" size="small"/>
            <Chip icon={<MusicNoteIcon />} label="80" size="small"/>
          </Stack>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
