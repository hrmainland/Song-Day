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
  Menu,
  MenuItem,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Droppable, Draggable } from "react-beautiful-dnd";

import { useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";
import { openSpotify } from "../../../utils/spotifyApiUtils";

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

const smallWidth = 750;
const verySmallWidth = 450;

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

    // Handle very small screen sizes
    if (width < verySmallWidth) {
      switch (columnIndex) {
        case 0: // Track number
          return { size: 0, display: false };
        case 1: // Album cover
          return { size: 2, display: true };
        case 2: // Title & artists
          return { size: 8, display: true }; // Expanded to fill space from removed columns
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
  
  // Handle small screen sizes
  if (width < smallWidth) {
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
      return { size: 1, display: true };
    case 2: // Title & artists
      return { size: 4, display: true };
    case 3: // Album name
      return { size: 4, display: true };
    case 4: // Duration
      return { size: 1, display: true };
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
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);

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
    const animationDuration = 200; // 100ms (faster animation)
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

  // Handle track element click to open menu
  const handleTrackClick = (event) => {
    event.stopPropagation();
    if (menuOpen) {
      handleCloseMenu();
    } else {
      setMenuAnchorEl(event.currentTarget);
    }
  };

  // Close track menu
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
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
        cursor: isDraggable ? "grab" : "pointer", // Always show pointer cursor
        position: "relative",
        overflow: "hidden",
        width: "100%", // Ensure the list item takes full width
        p: 0, // Remove padding to allow overlay to cover entire item
      }}
      onClick={handleTrackClick}
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
          px: { xs: 1, sm: 2 }, // Reduce horizontal padding on mobile
          position: "relative",
          zIndex: 1,
          overflow: "hidden" // Prevent content overflow
        }}
      >
        <Grid 
          container 
          spacing={1} 
          alignItems="center" 
          sx={{ 
            height: "100%",
            width: "100%",
            m: 0, // Remove margin
            flexWrap: "nowrap" // Prevent wrapping to a new line
          }}
        >
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
              sx={{
                width: width < smallWidth ? 55 : 50,
                height: width < smallWidth ? 55 : 50,
                borderRadius: width < smallWidth ? "4px" : "2px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            />
          </Grid>

          {/* Title and artists */}
          <Grid 
            item 
            xs={getGridSize(width, 2).size}
            sx={{ 
              display: getGridSize(width, 2).display ? "block" : "none",
              minWidth: 0, // Allow grid item to shrink below content size
              overflow: "hidden" // Ensure content doesn't overflow
            }}
          >
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              pl: 1,
              width: "100%", // Take full width of the grid item
              overflow: "hidden" // Ensure the Box doesn't overflow
            }}>
              <Box sx={{ width: "100%", overflow: "hidden" }}>
                <ListItemText
                  primary={track.name}
                  secondary={track.artists}
                  primaryTypographyProps={{
                    variant: "body1",
                    sx: {
                      ...STYLES.TRACK_NAME,
                      width: "100%", // Ensure text uses available space
                      display: "block" // Make sure it behaves as a block element
                    },
                  }}
                  secondaryTypographyProps={{
                    variant: "body2",
                    sx: {
                      ...STYLES.ALBUM_TEXT,
                      width: "100%", // Ensure text uses available space
                    },
                  }}
                  sx={{ 
                    m: 0, // Remove margins
                    width: "100%" // Ensure ListItemText uses available space
                  }}
                />
              </Box>
              {!getGridSize(width, 3).display && track.album ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    ...STYLES.ALBUM_TEXT,
                    width: "100%" // Ensure text uses available space
                  }}
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
            sx={{ 
              display: getGridSize(width, 5).display ? "flex" : "none",
              minWidth: width < verySmallWidth ? 50 : 70 // Ensure minimum width for action button column
            }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction();
                }}
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
      
      {/* Spotify Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()}
        disableRestoreFocus
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { minWidth: 180 }
          }
        }}
      >
        <MenuItem onClick={() => openSpotify(true, track.id)} sx={{ px: 2 }}>
          <Box
            component="img"
            src="/Spotify_Icon.svg"
            alt="Spotify icon"
            sx={{ height: 20, width: 20, mr: 1 }}
          />
          <Typography variant="body2" fontWeight={500}>PLAY ON SPOTIFY</Typography>
        </MenuItem>
      </Menu>
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
  subtitle = null,
  isOptions = false,
  isShortlist = false,
  addFunc,
  submitFunc,
  isMissingTracks,
  isDraggable = false,
  tracksLimit, // New prop for the maximum number of tracks allowed
}) {
  function submitButton() {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    if (!submitFunc) return null;

    return (
      <Button
        variant="outlined"
        disabled={isMissingTracks || isSubmitDisabled}
        onClick={() => {
          setIsSubmitDisabled(true);
          submitFunc();
        }}
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
              {subtitle && <Typography variant="body2">{subtitle}</Typography>}
            </Box>
            <Box
              component="img"
              src="/Spotify_Logo.svg"
              alt="Spotify logo"
              sx={{
                height: 25,
                mr: 2,
              }}
            ></Box>
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
              <ListItemHeader isOptions={isOptions} />

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
          <ListItemHeader isOptions={isOptions} />

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
function ListItemHeader({ isOptions = false }) {
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
      <Box sx={{ 
        width: "100%", 
        py: 1.5, 
        px: { xs: 1, sm: 2 },
        overflow: "hidden"
      }}>
        <Grid 
          container 
          spacing={1} 
          alignItems="center" 
          sx={{ 
            height: "100%",
            width: "100%",
            m: 0,
            flexWrap: "nowrap"
          }}
        >
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
          sx={{ 
            display: getGridSize(width, 5).display ? "flex" : "none",
            justifyContent: "center"
          }}
        >
          <Typography 
            variant="caption" 
            sx={{
              ...STYLES.HEADER_TEXT,
              mr: 1.5
            }}
          >
            {isOptions ? "ADD" : "REMOVE"}
          </Typography>
        </Grid>
      </Grid>
      </Box>
    </ListItem>
  );
}
