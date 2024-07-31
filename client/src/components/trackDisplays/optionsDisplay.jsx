import { Box, ImageListItemBar, Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import * as React from "react";

import OptionsDisplayItem from "./optionsDisplayItem";
import { artistString } from "../../../utils/spotifyApiUtils";

function OptionsDisplay({ tracks, addFunc }) {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: "10px",
          margin: "10px",
        }}
      >
        <h3>Your Options</h3>
        <List>
          {tracks.map((track, index) => {
            return (
              <OptionsDisplayItem
                key={track._id}
                track={track}
                addFunc={addFunc}
                index={index}
              ></OptionsDisplayItem>
            );
          })}
        </List>
      </Box>
    </>
  );
}

export default OptionsDisplay;
