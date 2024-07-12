import { Box, ImageListItemBar } from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";

import AddedDisplayItem from "./addedDisplayItem";
import { artistString } from "../../../utils/spotifyApiUtils";

function AddedDisplay() {
  const tracks = JSON.parse(localStorage.getItem("tracks")) || [];

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <List dense={true}>
          {tracks.map((track) => {
            return (
              <AddedDisplayItem key={track.id} track={track}></AddedDisplayItem>
            );
          })}
        </List>
      </Box>
    </>
  );
}

export default AddedDisplay;
