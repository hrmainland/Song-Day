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
  // const images = [
  //   "https://cdn.vectorstock.com/i/1000x1000/67/41/gramophone-hand-drawn-isolated-on-white-vector-42866741.webp",
  //   "https://cdn.vectorstock.com/i/2000v/11/32/single-one-line-drawing-retro-cassette-sticker-vector-42951132.avif",
  //   "https://cdn.vectorstock.com/i/2000v/11/11/single-one-line-drawing-radio-tape-or-boombox-vector-42951111.avif",
  // ];

  // const images = [
  //   "/public/gammaphone.png",
  // ];

  const images = [
    "https://mosaic.scdn.co/60/ab67616d00001e022ec0df7877422d06b43739f2ab67616d00001e028051cb5d497c5e49f1548b99ab67616d00001e02fa801a4035231185d97ab1a8ab67616d00001e02ff1a7df76be413eaffda8545",
    "https://mosaic.scdn.co/60/ab67616d00001e02086fceff02dffcb3a477f84bab67616d00001e021675d50a0ba7919b5e5797feab67616d00001e0273c9cbe83af982323cf47096ab67616d00001e02d2f230807131b7803f2cc40c",
    "https://mosaic.scdn.co/60/ab67616d00001e023c17d6a51967fe6c140b65a2ab67616d00001e02597b8d93b8b19688d39d6198ab67616d00001e02d81a98db4e5a9e6963e62132ab67616d00001e02f438be90ac49995fefb7200a",
    "https://mosaic.scdn.co/60/ab67616d00001e022f2eeee9b405f4d00428d84cab67616d00001e02852930b799f484bf60faacb2ab67616d00001e02929dae46c6b93942c7499b7dab67616d00001e02d231bd1716b71b6444e25f89",
    "https://mosaic.scdn.co/60/ab67616d00001e0208d4ee81268e602efcd442faab67616d00001e0290325706a644718adfaf6288ab67616d00001e029c08cc5ed4e36dc235e7883bab67616d00001e02c6b6244ab810f6b0b8528bfa"
  ]
  
  // Use deterministic image selection based on gameCode if available
  const imageIndex = game?.gameCode ? 
    game.gameCode.charCodeAt(game.gameCode.length - 1) % images.length : 
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
              fontSize: "1.3rem",
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
