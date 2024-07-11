import { Box, ImageListItemBar } from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";

import SearchDisplayItem from "./searchDisplayItem";
import { artistString } from "../../../utils/spotifyApiUtils";

function SearchDisplay({ tracks, rhs }) {
  if (rhs) {
    var sx = {
      width: "100%",
      maxWidth: 280,
      bgcolor: "background.paper",
      position: "absolute",
      top: 0,
      right: 0,
    };
  } else {
    var sx = {};
  }

  return (
    <>
      <Box sx={sx}>
        <List dense={rhs}>
          {tracks.map((track) => {
            const artists = artistString(track.artists);
            // TODO add error handling here
            const img = track.album.images[2].url;
            return (
              <SearchDisplayItem
                key={track.id}
                id={track.id}
                name={track.name}
                artists={artists}
                img={img}
                rhs={rhs}
              ></SearchDisplayItem>
            );
          })}
        </List>
      </Box>
    </>
  );
}

export default SearchDisplay;
