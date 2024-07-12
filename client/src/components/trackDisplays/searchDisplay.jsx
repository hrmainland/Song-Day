import { Box, ImageListItemBar } from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";

import SearchDisplayItem from "./searchDisplayItem";
import { artistString } from "../../../utils/spotifyApiUtils";

function SearchDisplay({ tracks, addFunc }) {
  return (
    <>
      <Box>
        <List>
          {tracks.map((track) => {
            const artists = artistString(track.artists);
            // TODO add error handling here
            const img = track.album.images[2].url;
            const formattedTrack = {
              id: track.id,
              name: track.name,
              artists,
              img,
            };
            return (
              <SearchDisplayItem
                key={track.id}
                track={formattedTrack}
                addFunc={addFunc}
              ></SearchDisplayItem>
            );
          })}
        </List>
      </Box>
    </>
  );
}

export default SearchDisplay;
