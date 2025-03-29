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

// Common style constants
const STYLES = {
  // Display and layout styles
  RESPONSIVE_HIDE_MOBILE: { display: { xs: "none", sm: "block" } },
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
    color: "text.secondary"
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
    opacity: 0,
    transition: "all 0.2s ease",
  },
  PAPER: {
    width: "100%", 
    borderRadius: "12px", 
    overflow: "hidden", 
    mb: 2
  },
  LIST_ITEM_PADDING: { py: 1.5 }
};

// Grid size constants
const GRID_SIZES = {
  NUMBER_COLUMN: 1,
  IMAGE_COLUMN_XS: 2,
  IMAGE_COLUMN_SM: 2,
  TITLE_COLUMN_NORMAL: 4,
  TITLE_COLUMN_COMPACT: 7,
  ALBUM_COLUMN: 3,
  DURATION_COLUMN: 2,
  
  // For avatar layout
  AVATAR_CONTAINER: {
    width: 45,
    display: "flex",
    justifyContent: "center",
  }
};

// Format track duration
const formatDuration = (ms) => {
  if (!ms) return "";
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// Unified TrackItem component that can be both draggable and non-draggable
function TrackItem({ 
  track, 
  index, 
  onAction, 
  isOptions, 
  isDraggable, 
  tracksLength, 
  compactView 
}) {
  // Create the item content
  const item = (
    <ListItem
      sx={{
        ...STYLES.LIST_ITEM_PADDING,
        transition: "all 0.2s ease",
        ...STYLES.LIST_HOVER,
        ...(index < tracksLength - 1 ? STYLES.BORDER_BOTTOM_LIGHT : {}),
        cursor: isDraggable ? "grab" : isOptions ? "pointer" : "default",
      }}
      onClick={isOptions ? onAction : undefined}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label={isOptions ? "add" : isDraggable ? "remove" : "delete"}
          onClick={isOptions ? undefined : onAction}
          sx={{
            ...STYLES.ICON_BUTTON,
            color: "text.secondary",
            "&:hover": { color: isOptions ? "primary.main" : "error.main" },
          }}
        >
          {isOptions ? <AddIcon /> : isDraggable ? <RemoveIcon /> : <DeleteIcon />}
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
          xs={GRID_SIZES.NUMBER_COLUMN}
          sx={STYLES.RESPONSIVE_HIDE_MOBILE}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
          >
            {index + 1}
          </Typography>
        </Grid>
        <Grid item xs={GRID_SIZES.IMAGE_COLUMN_XS} sm={GRID_SIZES.IMAGE_COLUMN_SM}>
          <Avatar
            variant="square"
            src={track.img}
            sx={STYLES.AVATAR_SQUARE}
          />
        </Grid>

        <Grid item xs={compactView ? GRID_SIZES.TITLE_COLUMN_COMPACT : GRID_SIZES.TITLE_COLUMN_NORMAL}>
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

        {!compactView && (
          <Grid
            item
            xs={GRID_SIZES.ALBUM_COLUMN}
            sx={STYLES.RESPONSIVE_HIDE_MOBILE}
          >
            <ListItemText
              secondary={track.album || ""}
              secondaryTypographyProps={{
                variant: "body2",
                sx: STYLES.ALBUM_TEXT,
              }}
            />
          </Grid>
        )}

        <Grid item xs={GRID_SIZES.DURATION_COLUMN}>
          <Typography variant="body2" color="text.secondary">
            {formatDuration(track.duration_ms)}
          </Typography>
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
  compactView = false
}) {
  // Render the component
  return (
    <Paper sx={STYLES.PAPER}>
      {/* Header */}
      <Box sx={{ p: 2, ...STYLES.TABLE_HEADER_BG }}>
        <Typography variant="h6" fontWeight={500}>{title}</Typography>
        {isShortlist && <Typography variant="body2">Drag and drop to rearrange</Typography>}
        {isOptions && <Typography variant="body2">Select to shortlist</Typography>}
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
              <ListItemHeader compactView={compactView} />
              
              {/* Track Items */}
              {tracks.map((track, index) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  index={index}
                  onAction={
                    isOptions ? 
                    () => addFunc(track, index) : 
                    () => onRemoveTrack(track, index)
                  }
                  isOptions={isOptions}
                  isDraggable={isDraggable}
                  tracksLength={tracks.length}
                  compactView={compactView}
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
          <ListItemHeader compactView={compactView} />
          
          {/* Track Items */}
          {tracks.map((track, index) => (
            <TrackItem
              key={track.id}
              track={track}
              index={index}
              onAction={
                isOptions ? 
                () => addFunc(track, index) : 
                () => onRemoveTrack(track, index)
              }
              isOptions={isOptions}
              isDraggable={false}
              tracksLength={tracks.length}
              compactView={compactView}
            />
          ))}
        </List>
      )}
    </Paper>
  );
}

// Helper component for the list header
function ListItemHeader({ compactView }) {
  return (
    <ListItem
      sx={{
        ...STYLES.TABLE_HEADER_BG,
        ...STYLES.BORDER_BOTTOM,
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
          xs={GRID_SIZES.NUMBER_COLUMN}
          sx={STYLES.RESPONSIVE_HIDE_MOBILE}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            align="center"
          >
            #
          </Typography>
        </Grid>
        <Grid item xs={GRID_SIZES.IMAGE_COLUMN_XS} sm={GRID_SIZES.IMAGE_COLUMN_SM}>
          <Box sx={GRID_SIZES.AVATAR_CONTAINER} />
        </Grid>
        <Grid item xs={compactView ? GRID_SIZES.TITLE_COLUMN_COMPACT : GRID_SIZES.TITLE_COLUMN_NORMAL}>
          <ListItemText
            secondary="TITLE"
            secondaryTypographyProps={{
              variant: "caption",
              sx: STYLES.HEADER_TEXT,
            }}
          />
        </Grid>
        {!compactView && (
          <Grid
            item
            xs={GRID_SIZES.ALBUM_COLUMN}
            sx={STYLES.RESPONSIVE_HIDE_MOBILE}
          >
            <ListItemText
              secondary="ALBUM"
              secondaryTypographyProps={{
                variant: "caption",
                sx: STYLES.HEADER_TEXT,
              }}
            />
          </Grid>
        )}
        <Grid item xs={GRID_SIZES.DURATION_COLUMN}>
          <Box display="flex" justifyContent="flex-start">
            <AccessTimeIcon
              fontSize="small"
              sx={{ color: "text.secondary" }}
            />
          </Box>
        </Grid>
      </Grid>
    </ListItem>
  );
}