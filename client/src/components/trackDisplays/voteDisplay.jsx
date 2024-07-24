import { Box } from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import VoteDisplayItem from "./voteDisplayItem";

function VoteDisplay({ tracks }) {
  const onDragEnd = (result) => {};

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
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
      </DragDropContext>
    </>
  );
}

export default VoteDisplay;
