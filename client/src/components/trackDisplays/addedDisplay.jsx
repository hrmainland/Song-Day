import { Box, Button, Tooltip } from "@mui/material";
import List from "@mui/material/List";

import AddedDisplayItem from "./addedDisplayItem";

export default function AddedDisplay({ tracks, removeFunc, submitFunc, missingTracks }) {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          // position: "absolute",
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2, // Add some margin-top to separate from the list items
            }}
          >
            {missingTracks ? (
              <Tooltip
                title={`You need to add ${missingTracks} more track${
                  missingTracks > 1 ? "s" : ""
                }`}
              >
                <span>
                  <Button variant="outlined" disabled onClick={submitFunc}>
                    Submit
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Button variant="outlined" onClick={submitFunc}>
                Submit
              </Button>
            )}
          </Box>
        </List>
      </Box>
    </>
  );
}


