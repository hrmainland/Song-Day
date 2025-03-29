import React from "react";
import {
  Paper,
  List,
  ListItem,
  Grid,
  Box,
  Typography,
  ListItemText,
  Avatar,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Format track duration
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function AddedTracksList({ tracks, onRemoveTrack }) {
  return (
    <Paper sx={{ borderRadius: "12px", overflow: "hidden", mb: 2 }}>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        <ListItem
          sx={{
            pt: 2,
            bgcolor: "rgba(0,0,0,0.02)",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
          secondaryAction={
            <IconButton edge="end" sx={{ mr: 2 }}>
              <Box sx={{ width: 24, height: 24 }} />
            </IconButton>
          }
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <Grid
              item
              xs={1}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                align="center"
              >
                #
              </Typography>
            </Grid>
            <Grid item xs={2} sm={1}>
              <Box
                sx={{
                  width: 45,
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <ListItemText
                secondary="TITLE"
                secondaryTypographyProps={{
                  variant: "caption",
                  sx: {
                    color: "text.secondary",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  },
                }}
              />
            </Grid>
            <Grid
              item
              xs={3}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <ListItemText
                secondary="ALBUM"
                secondaryTypographyProps={{
                  variant: "caption",
                  sx: {
                    color: "text.secondary",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Box display="flex" justifyContent="flex-start">
                <AccessTimeIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              </Box>
            </Grid>
          </Grid>
        </ListItem>

        {tracks.map((track, index) => (
          <ListItem
            key={track.id}
            sx={{
              py: 1.5,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
                "& .MuiIconButton-root": { opacity: 1 },
              },
              borderBottom:
                index < tracks.length - 1
                  ? "1px solid rgba(0,0,0,0.06)"
                  : "none",
            }}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onRemoveTrack(track)}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "error.main" },
                  opacity: 0,
                  transition: "all 0.2s ease",
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ height: "100%" }}
            >
              <Grid
                item
                xs={1}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={1}>
                <Avatar
                  variant="square"
                  src={track.img}
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </Grid>

              <Grid item xs={5}>
                <ListItemText
                  primary={track.name}
                  secondary={track.artists}
                  primaryTypographyProps={{
                    variant: "body1",
                    sx: {
                      fontSize: 16,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                  secondaryTypographyProps={{
                    variant: "body2",
                    sx: {
                      color: "text.secondary",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </Grid>

              <Grid
                item
                xs={3}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <ListItemText
                  secondary={track.album || ""}
                  secondaryTypographyProps={{
                    variant: "body2",
                    sx: {
                      color: "text.secondary",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  {track.duration_ms
                    ? formatDuration(track.duration_ms)
                    : ""}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}