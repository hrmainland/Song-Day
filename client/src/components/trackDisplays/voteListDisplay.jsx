import { Box, ImageListItemBar, Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import * as React from "react";

import VoteListDisplayItem from "./voteListDisplayItem";
import { artistString } from "../../../utils/spotifyApiUtils";

function VoteListDisplay({ tracks, addFunc }) {
  return (
    <>
      <Box>
        <List>
          {tracks.map((track, index) => {
            return (
              <VoteListDisplayItem
                key={track._id}
                track={track}
                addFunc={addFunc}
                index={index}
              ></VoteListDisplayItem>
            );
          })}
        </List>
      </Box>
    </>
  );
}

export default VoteListDisplay;
