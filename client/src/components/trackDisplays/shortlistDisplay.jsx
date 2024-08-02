import { Box, List, ListItem, Button, Tooltip } from "@mui/material";
import * as React from "react";
import { Droppable } from "react-beautiful-dnd";

import ShortlistDisplayItem from "./shortlistDisplayItem";

export default function ShortlistDisplay({
  tracks,
  removeFunc,
  submitFunc,
  missingTracks,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        padding: "10px",
        margin: "10px",
      }}
    >
      <h3>Your Shortlist</h3>
      <Droppable droppableId="main-column">
        {(provided) => (
          <List ref={provided.innerRef} {...provided.droppableProps}>
            {tracks.map((track, index) => {
              return (
                <ShortlistDisplayItem
                  key={track._id}
                  track={track}
                  index={index}
                  removeFunc={removeFunc}
                ></ShortlistDisplayItem>
              );
            })}
            {provided.placeholder}

            <ListItem
              sx={{
                display: "flex",
                justifyContent: "flex-end",
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
            </ListItem>
          </List>
        )}
      </Droppable>
    </Box>
  );
}
