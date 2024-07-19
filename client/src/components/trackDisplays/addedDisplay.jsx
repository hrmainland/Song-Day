import { Box, ImageListItemBar, Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import * as React from "react";

import AddedDisplayItem from "./addedDisplayItem";
import { artistString } from "../../../utils/spotifyApiUtils";

function AddedDisplay({ tracks, removeFunc, submitFunc }) {
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
              <AddedDisplayItem
                key={track.id}
                track={track}
                removeFunc={removeFunc}
              ></AddedDisplayItem>
            );
          })}
          <ListItem>
            <Button variant="outlined" onClick={submitFunc}>
              Submit
            </Button>
          </ListItem>
        </List>
      </Box>
    </>
  );
}

export default AddedDisplay;
