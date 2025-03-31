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
  Button,
  Tabs,
  Tab,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Droppable, Draggable } from "react-beautiful-dnd";

import { useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

// Common style constants
const STYLES = {
  // Display and layout styles
  RESPONSIVE_HIDE_MOBILE: { display: "block" },
  TABLE_HEADER_BG: { bgcolor: "rgba(0,0,0,0.02)" },
  BORDER_BOTTOM: { borderBottom: "1px solid rgba(0,0,0,0.08)" },
  BORDER_BOTTOM_LIGHT: { borderBottom: "1px solid rgba(0,0,0,0.06)" },
  LIST_HOVER: {
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.04)",
      "& .MuiIconButton-root": { opacity: 1 },
    },
  },

  // Text styling
  ALBUM_TEXT: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "text.secondary",
  },
  TRACK_NAME: {
    fontSize: 16,
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  HEADER_TEXT: {
    color: "text.secondary",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },

  // Component styling
  AVATAR_SQUARE: {
    width: 45,
    height: 45,
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  ICON_BUTTON: {
    opacity: 0.5,
    transition: "all 0.2s ease",
  },
  PAPER: {
    width: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    mb: 2,
  },
  LIST_ITEM_PADDING: { py: 1.5 },
};

// Format track duration
const formatDuration = (ms) => {
  if (!ms) return "";
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

function useSize(ref) {
  const [width, setWidth] = useState(0);

  useResizeObserver(ref, (entry) => {
    setWidth(entry.contentRect.width);
  });

  return width;
}

function getGridSize(width, columnIndex) {
  switch (columnIndex) {
    case 0:
      return 1;
    case 3:
      return 3;
    case 4:
      return 2;
    case 5:
      return 1;
  }
  if (width < 600) {
    switch (columnIndex) {
      case 1:
        return 3;
      case 2:
        return 5;
    }
  }
  switch (columnIndex) {
    case 1:
      return 2;
    case 2:
      return 3;
  }
}

// Unified TrackItem component that can be both draggable and non-draggable
function TrackItem({
  track,
  index,
  onAction,
  isOptions,
  isDraggable,
  tracksLength,
}) {
  const ref = useRef(null);
  const width = useSize(ref);
  // Create the item content
  const item = (
    <ListItem
      ref={ref}
      sx={{
        ...STYLES.LIST_ITEM_PADDING,
        transition: "all 0.2s ease",
        ...STYLES.LIST_HOVER,
        ...(index < tracksLength - 1 ? STYLES.BORDER_BOTTOM_LIGHT : {}),
        cursor: isDraggable ? "grab" : isOptions ? "pointer" : "default",
      }}
      onClick={isOptions ? onAction : undefined}
    >
      <Grid container spacing={1} alignItems="center" sx={{ height: "100%" }}>
        <Grid
          item
          xs={getGridSize(width, 0)}
          sx={STYLES.RESPONSIVE_HIDE_MOBILE}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            {/* {index + 1} */}
            {width}
          </Typography>
        </Grid>
        <Grid
          item
          xs={getGridSize(width, 1)}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Avatar variant="square" src={track.img} sx={STYLES.AVATAR_SQUARE} />
        </Grid>

        <Grid item xs={getGridSize(width, 2)}>
          <ListItemText
            primary={track.name}
            secondary={track.artists}
            primaryTypographyProps={{
              variant: "body1",
              sx: STYLES.TRACK_NAME,
            }}
            secondaryTypographyProps={{
              variant: "body2",
              sx: STYLES.ALBUM_TEXT,
            }}
          />
        </Grid>


          <Grid
            item
            xs={getGridSize(width, 3)}
            sx={{ display: width < 600 ? "none" : "block" }}
          >
            <ListItemText
              secondary={track.album || ""}
              secondaryTypographyProps={{
                variant: "body2",
                sx: STYLES.ALBUM_TEXT,
              }}
            />
          </Grid>


        <Grid item xs={getGridSize(width, 4)}>
          <Typography variant="body2" color="text.secondary">
            {formatDuration(track.duration_ms)}
          </Typography>
        </Grid>
        <Grid item xs={getGridSize(width, 5)} container justifyContent="center">
          <IconButton
            edge="end"
            aria-label={isOptions ? "add" : isDraggable ? "remove" : "delete"}
            onClick={isOptions ? undefined : onAction}
            sx={{
              ...STYLES.ICON_BUTTON,
              color: "text.secondary",
              "&:hover": { color: isOptions ? "primary.main" : "error.main" },
              mr: 1.5,
            }}
          >
            {isOptions ? (
              <AddIcon />
            ) : isDraggable ? (
              <RemoveIcon />
            ) : (
              <DeleteIcon />
            )}
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  );

  // If draggable, wrap the item in a Draggable component
  if (isDraggable) {
    return (
      <Draggable draggableId={track.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {item}
          </div>
        )}
      </Draggable>
    );
  }

  // Otherwise, return the item directly
  return item;
}

export default function AddedTracksList({
  tracks,
  onRemoveTrack,
  title = "Tracks",
  isOptions = false,
  isShortlist = false,
  addFunc,
  submitFunc,
  missingTracks,
  isDraggable = false,
}) {
  // Render the component
  return (
    <Paper sx={STYLES.PAPER}>
      {/* Header */}
      <Box sx={{ p: 2, ...STYLES.TABLE_HEADER_BG }}>
        <Typography variant="h6" fontWeight={500}>
          {title}
        </Typography>
        {isShortlist && (
          <Typography variant="body2">Drag and drop to rearrange</Typography>
        )}
        {isOptions && (
          <Typography variant="body2">Select songs to shortlist</Typography>
        )}
      </Box>

      {/* Content - Conditional Droppable */}
      {isDraggable ? (
        <Droppable droppableId="main-column">
          {(provided) => (
            <List
              sx={{ width: "100%", bgcolor: "background.paper" }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {/* Table Header */}
              <ListItemHeader/>

              {/* Track Items */}
              {tracks.map((track, index) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  index={index}
                  onAction={
                    isOptions
                      ? () => addFunc(track, index)
                      : () => onRemoveTrack(track, index)
                  }
                  isOptions={isOptions}
                  isDraggable={isDraggable}
                  tracksLength={tracks.length}
                />
              ))}
              {provided.placeholder}

              {/* Submit Button */}
              {isShortlist && (
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {missingTracks ? (
                    <Button variant="outlined" disabled onClick={submitFunc}>
                      Submit
                    </Button>
                  ) : (
                    <Button variant="outlined" onClick={submitFunc}>
                      Submit
                    </Button>
                  )}
                </ListItem>
              )}
            </List>
          )}
        </Droppable>
      ) : (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {/* Table Header */}
          <ListItemHeader />

          {/* Track Items */}
          {tracks.map((track, index) => (
            <TrackItem
              key={track.id}
              track={track}
              index={index}
              onAction={
                isOptions
                  ? () => addFunc(track, index)
                  : () => onRemoveTrack(track, index)
              }
              isOptions={isOptions}
              isDraggable={false}
              tracksLength={tracks.length}
              
            />
          ))}
        </List>
      )}
    </Paper>
  );
}

// Helper component for the list header
function ListItemHeader() {
  const ref = useRef(null);
  const width = useSize(ref);
  return (
    <ListItem
      ref={ref}
      sx={{
        ...STYLES.TABLE_HEADER_BG,
        ...STYLES.BORDER_BOTTOM,
      }}
    >
      <Grid container spacing={2} alignItems="center" sx={{ height: "100%" }}>
        <Grid item xs={getGridSize(width, 0)}>
          <Typography variant="subtitle2" color="text.secondary" align="center">
            #
          </Typography>
        </Grid>
        <Grid item xs={getGridSize(width, 1)}>
          <Box
            sx={{
              width: 45,
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Grid>
        <Grid item xs={getGridSize(width, 2)}>
          <ListItemText
            secondary="TITLE"
            secondaryTypographyProps={{
              variant: "caption",
              sx: STYLES.HEADER_TEXT,
            }}
          />
        </Grid>

          <Grid
            item
            xs={getGridSize(width, 3)}
            sx={{ display: width < 600 ? "none" : "block" }}
          >
            <ListItemText
              secondary="ALBUM"
              secondaryTypographyProps={{
                variant: "caption",
                sx: STYLES.HEADER_TEXT,
              }}
            />
          </Grid>

        <Grid item xs={getGridSize(width, 4)}>
          <Box display="flex" justifyContent="flex-start">
            <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </Box>
        </Grid>
        <Grid item xs={getGridSize(width, 5)}>
          <IconButton edge="end" sx={{ mr: 1.5 }}>
            <Box sx={{ width: 24, height: 24 }} />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  );
}
