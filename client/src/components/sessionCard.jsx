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
      <Card
        sx={{
          width: { xxs: 280, xs: 250 },
          transition:
            "transform 0.1s ease, box-shadow 0.1s ease-in-out",
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "1px 1px 4px 0px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
          },
          borderRadius: 4,
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          elevation: 0,
          boxShadow: "none",
        }}
      >
        <CardMedia
          // sx={{ height: {xxs: 105, xs: 135} }}
          sx={{ height: { xxs: 210, xs: 220 } }}
          image={`${
            [
              // "https://images.unsplash.com/photo-1596743887991-4f07d0e823e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              // "https://mosaic.scdn.co/60/ab67616d00001e022ec0df7877422d06b43739f2ab67616d00001e028051cb5d497c5e49f1548b99ab67616d00001e02fa801a4035231185d97ab1a8ab67616d00001e02ff1a7df76be413eaffda8545",
              // "https://images.unsplash.com/photo-1594328082970-cf6a92166067?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              // "https://images.unsplash.com/photo-1526269982786-96fcd6b53d45?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              // "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              // "https://images.unsplash.com/photo-1492560704044-e15259ca1c61?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              // "https://images.unsplash.com/photo-1597075383833-a10d2f819ca9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              // "https://images.unsplash.com/photo-1526327760257-75f515c74478?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              // "https://images.unsplash.com/photo-1458560871784-56d23406c091?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "https://cdn.vectorstock.com/i/1000x1000/67/41/gramophone-hand-drawn-isolated-on-white-vector-42866741.webp",
              "https://cdn.vectorstock.com/i/2000v/11/32/single-one-line-drawing-retro-cassette-sticker-vector-42951132.avif",
              "https://cdn.vectorstock.com/i/2000v/11/11/single-one-line-drawing-radio-tape-or-boombox-vector-42951111.avif",
            ][Math.floor(Math.random() * 3)]
          }`}
        />
        <CardContent>
          <Typography
            variant="caption"
            gutterBottom
            sx={{ display: "block", color: "#407ea0" }}
          >
            4 Feb 2024
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              mb: 2,
            }}
          >
            Greece Hottest 100
          </Typography>
          <Stack direction="row" spacing={2}>
            <Chip icon={<PersonOutlineIcon />} label="8" size="small" />
            <Chip icon={<MusicNoteIcon />} label="80" size="small" />
          </Stack>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
