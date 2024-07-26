import { Box } from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";
import { Droppable } from "react-beautiful-dnd";

import VoteDisplayItem from "./voteChoiceDisplayItem";

function VoteChoiceDisplay({ tracks }) {
  return (
    <Droppable droppableId="main-column">
      {(provided) => (
        <List ref={provided.innerRef} {...provided.droppableProps}>
          {tracks.map((track, index) => {
            return (
              <VoteDisplayItem
                key={track._id}
                track={track}
                index={index}
              ></VoteDisplayItem>
            );
          })}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  );
}

export default VoteChoiceDisplay;
