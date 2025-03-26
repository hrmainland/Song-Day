import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Stack, Chip, ThemeProvider } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import theme from "../../utils/theme";

export default function SessionCard({ game, onClick }) {
  // Fixed images for demo purposes
  const images = [
    "https://cdn.vectorstock.com/i/1000x1000/67/41/gramophone-hand-drawn-isolated-on-white-vector-42866741.webp",
    "https://cdn.vectorstock.com/i/2000v/11/32/single-one-line-drawing-retro-cassette-sticker-vector-42951132.avif",
    "https://cdn.vectorstock.com/i/2000v/11/11/single-one-line-drawing-radio-tape-or-boombox-vector-42951111.avif",
  ];
  
  // Use deterministic image selection based on gameCode if available
  const imageIndex = game?.gameCode ? 
    game.gameCode.charCodeAt(0) % images.length : 
    Math.floor(Math.random() * images.length);
  
  // Demo date - will be replaced later
  const demoDate = "4 Feb 2024";
  
  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          width: { xxs: 280, xs: 250 },
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          },
          borderRadius: 4,
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          boxShadow: "none",
        }}
        onClick={onClick}
      >
        <CardMedia
          sx={{ height: { xxs: 210, xs: 220 } }}
          image={images[imageIndex]}
        />
        <CardContent>
          <Typography
            variant="caption"
            gutterBottom
            sx={{ display: "block", color: theme.palette.primary.main }}
          >
            {demoDate}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              mb: 2,
            }}
          >
            {game?.title || "Greece Hottest 100"}
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
