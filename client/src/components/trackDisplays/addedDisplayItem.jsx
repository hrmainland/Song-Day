import { Box, Grow } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import * as React from "react";

function AddedDisplayItem({ track }) {
  if (track.name.length > 60) {
    track.name = track.name.substring(0, 59) + "…";
  }
  if (track.artists.length > 30) {
    track.artists = track.artists.substring(0, 29) + "…";
  }
  return (
    <>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar
            src={track.img}
            variant="square"
            sx={{ width: 50, height: 50, paddingRight: "5px" }}
          />
        </ListItemAvatar>
        <ListItemText primary={track.name} secondary={track.artists} />
      </ListItem>
    </>
  );
}

export default AddedDisplayItem;
