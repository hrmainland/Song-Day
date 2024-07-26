import { Box } from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";
import { Droppable } from "react-beautiful-dnd";

import ShortlistDisplayItem from "./shortlistDisplayItem";

export default function ShortlistDisplay({ tracks, removeFunc }) {
  return (
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
        </List>
      )}
    </Droppable>
  );
}
