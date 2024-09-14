import { Box } from "@mui/material";
import List from "@mui/material/List";

import SearchDisplayItem from "./searchDisplayItem";
import { artistString } from "../../../utils/spotifyApiUtils";

export default function SearchDisplay({ tracks, addFunc }) {
  return (
    <>
      <Box sx={{ height: "70vh", overflow: "auto" }}>
        {" "}
        {/* Set the height and enable scrolling */}
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
              />
            );
          })}
        </List>
      </Box>
    </>
  );
}

