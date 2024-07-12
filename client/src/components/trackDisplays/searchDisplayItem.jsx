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

function SearchDisplayItem({ track, addFunc }) {
  const { id, name, artists, img } = track;

  const handleClick = () => {
    addFunc(track);
  };
  // const selectTrack = () => {
  //   const thisTrack = { id, name, artists, img };
  //   let tracks = localStorage.getItem("tracks");
  //   if (!tracks) {
  //     tracks = [thisTrack];
  //   } else {
  //     tracks = JSON.parse(tracks);
  //     tracks.push(thisTrack);
  //   }
  //   localStorage.setItem("tracks", JSON.stringify(tracks));
  // };

  return (
    <>
      <ListItem sx={{ cursor: "pointer" }} onClick={handleClick}>
        <ListItemAvatar>
          <Avatar
            src={img}
            variant="square"
            sx={{ width: 60, height: 60, paddingRight: "5px" }}
          />
        </ListItemAvatar>
        <ListItemText primary={name} secondary={artists} />
      </ListItem>
    </>
  );
}

export default SearchDisplayItem;
