import { Box } from "@mui/material";
import List from "@mui/material/List";

import OptionsDisplayItem from "./optionsDisplayItem";

export default function OptionsDisplay({ tracks, addFunc }) {
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

