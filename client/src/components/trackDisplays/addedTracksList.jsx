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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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

const dropAlbumWidth = 750;

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
  // Return values are [size, display]
  // If display is false, the column should be hidden
  
  // Handle small screen sizes
  if (width < dropAlbumWidth) {
    switch (columnIndex) {
      case 0: // Track number
        return { size: 1, display: true };
      case 1: // Album cover
        return { size: 3, display: true };
      case 2: // Title & artists
        return { size: 6, display: true }; // Expanded to fill space from removed columns
      case 3: // Album name
        return { size: 0, display: false }; // Hide on small screens
      case 4: // Duration
        return { size: 0, display: false }; // Hide on small screens
      case 5: // Action button
        return { size: 2, display: true }; // Slightly larger action button on small screens
      default:
        return { size: 1, display: true };
    }
  }
  
  // Handle larger screen sizes
  switch (columnIndex) {
    case 0: // Track number
      return { size: 1, display: true };
    case 1: // Album cover
      return { size: 2, display: true };
    case 2: // Title & artists
      return { size: 3, display: true };
    case 3: // Album name
      return { size: 3, display: true };
    case 4: // Duration
      return { size: 2, display: true };
    case 5: // Action button
      return { size: 1, display: true };
    default:
      return { size: 1, display: true };
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
  isLimitReached, // Add new prop to check if track limit is reached
}) {
  const ref = useRef(null);
  const width = useSize(ref);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle click with animation
  const handleAction = () => {
    // If options list and limit reached, don't animate or trigger action
    if (isOptions && isLimitReached) {
      return;
    }
    
    if (isAnimating) return; // Prevent multiple clicks during animation

    setIsAnimating(true);
    setProgress(0); // Reset progress to ensure animation starts from beginning

    // Animate the progress
    const animationDuration = 100; // 100ms (faster animation)
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / animationDuration) * 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        // Keep the full-width overlay for a moment before completing the action
        setTimeout(() => {
          if (onAction) onAction();
        }, 20); // Short delay to ensure animation completes visually
      }
    };

    requestAnimationFrame(animate);
  };

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
        position: "relative",
        overflow: "hidden",
        width: "100%", // Ensure the list item takes full width
        p: 0, // Remove padding to allow overlay to cover entire item
      }}
      onClick={isOptions ? handleAction : undefined}
    >
      {/* Animation overlay - positioned directly in the ListItem for full width coverage */}
      {isAnimating && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${progress}%`,
            backgroundColor: isOptions
              ? "rgba(76, 175, 80, 0.2)" // Green for adding to shortlist
              : "rgba(211, 47, 47, 0.2)", // Red for removing from shortlist
            zIndex: 10, // Higher z-index to ensure it appears above all content
            transition: "none", // Remove transition to use direct RAF updates
            pointerEvents: "none", // Ensure the overlay doesn't block interaction
          }}
        />
      )}

      {/* Padding container - this ensures content still has padding */}
      <Box
        sx={{
          width: "100%",
          py: 1.5, // Match the original padding
          px: 2, // Add horizontal padding
          position: "relative",
          zIndex: 1,
        }}
      >
        <Grid container spacing={1} alignItems="center" sx={{ height: "100%" }}>
          {/* Track number */}
          <Grid
            item
            xs={getGridSize(width, 0).size}
            sx={{ display: getGridSize(width, 0).display ? "block" : "none" }}
          >
            <Typography variant="body2" color="text.secondary" align="center">
              {index + 1}
            </Typography>
          </Grid>

          {/* Album cover */}
          <Grid
            item
            xs={getGridSize(width, 1).size}
            sx={{ 
              display: getGridSize(width, 1).display ? "flex" : "none",
              justifyContent: "center" 
            }}
          >
            <Avatar
              variant="square"
              src={track.img}
              sx={STYLES.AVATAR_SQUARE}
            />
          </Grid>

          {/* Title and artists */}
          <Grid 
            item 
            xs={getGridSize(width, 2).size}
            sx={{ display: getGridSize(width, 2).display ? "block" : "none" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
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
              {!getGridSize(width, 3).display && track.album ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={STYLES.ALBUM_TEXT}
                >
                  {track.album}
                </Typography>
              ) : null}
            </Box>
          </Grid>

          {/* Album name */}
          <Grid
            item
            xs={getGridSize(width, 3).size}
            sx={{ display: getGridSize(width, 3).display ? "block" : "none" }}
          >
            <ListItemText
              secondary={track.album || ""}
              secondaryTypographyProps={{
                variant: "body2",
                sx: STYLES.ALBUM_TEXT,
              }}
            />
          </Grid>

          {/* Duration */}
          <Grid
            item
            xs={getGridSize(width, 4).size}
            sx={{ display: getGridSize(width, 4).display ? "block" : "none" }}
          >
            <Typography variant="body2" color="text.secondary">
              {formatDuration(track.duration_ms)}
            </Typography>
          </Grid>

          {/* Action button */}
          <Grid
            item
            xs={getGridSize(width, 5).size}
            sx={{ display: getGridSize(width, 5).display ? "flex" : "none" }}
            container
            justifyContent="center"
          >
            {isOptions && isLimitReached ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'text.secondary',
                opacity: 0.7,
                mr: 1.5,
                fontSize: '0.85rem'
              }}>
                Limit reached
              </Box>
            ) : (
              <IconButton
                edge="end"
                aria-label={isOptions ? "add" : isDraggable ? "remove" : "delete"}
                onClick={isOptions ? undefined : handleAction}
                disabled={isAnimating || (isOptions && isLimitReached)}
                sx={{
                  ...STYLES.ICON_BUTTON,
                  color: isAnimating ? "#4caf50" : "text.secondary",
                  "&:hover": {
                    color: isAnimating
                      ? "#4caf50"
                      : isOptions
                      ? "primary.main"
                      : "error.main",
                  },
                  mr: 1.5,
                  transition: "all 0.2s ease",
                }}
              >
                {isAnimating ? (
                  <CheckCircleIcon />
                ) : isOptions ? (
                  <AddIcon />
                ) : isDraggable ? (
                  <RemoveIcon />
                ) : (
                  <DeleteIcon />
                )}
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Box>
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
  title = null,
  isOptions = false,
  isShortlist = false,
  addFunc,
  submitFunc,
  isMissingTracks,
  isDraggable = false,
  tracksLimit, // New prop for the maximum number of tracks allowed
}) {
  function submitButton() {
    if (!submitFunc) return null;

    return (
      <Button
        variant="outlined"
        disabled={isMissingTracks}
        onClick={submitFunc}
        sx={{
          borderRadius: "12px",
          px: 3,
          py: 1.2,
        }}
      >
        Submit
      </Button>
    );
  }

  // Render the component
  return (
    <Paper
      sx={{
        ...STYLES.PAPER,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      {title && (
        <Box sx={{ p: 2, ...STYLES.TABLE_HEADER_BG }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={500}>
                {title}
              </Typography>
              {isShortlist && !isOptions && (
                <Typography variant="body2">
                  Drag and drop to rearrange
                </Typography>
              )}
              {isOptions && (
                <Typography variant="body2">
                  Select songs to shortlist
                </Typography>
              )}
            </Box>
            {submitFunc && <Box>{submitButton()}</Box>}
          </Box>
        </Box>
      )}

      {/* Content - Conditional Droppable */}
      {isDraggable ? (
        <Droppable droppableId="main-column">
          {(provided) => (
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                p: 0,
                m: 0,
              }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
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
                  isDraggable={isDraggable}
                  tracksLength={tracks.length}
                  isLimitReached={isOptions && !isMissingTracks}
                />
              ))}

              {provided.placeholder}

              {/* Submit Button */}
              {submitFunc && (
                <ListItem
                  sx={{ display: "flex", justifyContent: "end", mt: 2 }}
                >
                  {submitButton()}
                </ListItem>
              )}
            </List>
          )}
        </Droppable>
      ) : (
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            p: 0,
            m: 0,
          }}
        >
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
              isLimitReached={isOptions && !isMissingTracks}
            />
          ))}
          {submitFunc && (
            <ListItem sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
              {submitButton()}
            </ListItem>
          )}
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
        p: 0, // Remove default padding
      }}
    >
      <Box sx={{ width: "100%", py: 1.5, px: 2 }}>
        <Grid container spacing={1} alignItems="center" sx={{ height: "100%" }}>
        {/* Track number header */}
        <Grid 
          item 
          xs={getGridSize(width, 0).size}
          sx={{ display: getGridSize(width, 0).display ? "block" : "none" }}
        >
          <Typography variant="subtitle2" color="text.secondary" align="center">
            #
          </Typography>
        </Grid>
        
        {/* Album cover placeholder */}
        <Grid 
          item 
          xs={getGridSize(width, 1).size}
          sx={{ display: getGridSize(width, 1).display ? "block" : "none" }}
        >
          <Box
            sx={{
              width: 45,
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Grid>
        
        {/* Title header */}
        <Grid 
          item 
          xs={getGridSize(width, 2).size}
          sx={{ display: getGridSize(width, 2).display ? "block" : "none" }}
        >
          <ListItemText
            secondary="TITLE"
            secondaryTypographyProps={{
              variant: "caption",
              sx: STYLES.HEADER_TEXT,
            }}
          />
        </Grid>

        {/* Album header */}
        <Grid
          item
          xs={getGridSize(width, 3).size}
          sx={{ display: getGridSize(width, 3).display ? "block" : "none" }}
        >
          <ListItemText
            secondary="ALBUM"
            secondaryTypographyProps={{
              variant: "caption",
              sx: STYLES.HEADER_TEXT,
            }}
          />
        </Grid>

        {/* Duration header */}
        <Grid
          item
          xs={getGridSize(width, 4).size}
          sx={{ display: getGridSize(width, 4).display ? "block" : "none" }}
        >
          <Box display="flex" justifyContent="flex-start">
            <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </Box>
        </Grid>
        
        {/* Action button placeholder */}
        <Grid 
          item 
          xs={getGridSize(width, 5).size}
          sx={{ display: getGridSize(width, 5).display ? "block" : "none" }}
        >
          <IconButton edge="end" sx={{ mr: 1.5 }}>
            <Box sx={{ width: 24, height: 24 }} />
          </IconButton>
        </Grid>
      </Grid>
      </Box>
    </ListItem>
  );
}
