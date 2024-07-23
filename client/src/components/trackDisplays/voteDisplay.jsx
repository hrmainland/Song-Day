import { Box } from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Column from "../column";

import VoteDisplayItem from "./voteDisplayItem";

function VoteDisplay({ tracks }) {
  const state = {
    tasks: {
      "task-1": { id: "task-1", content: "Take out the garbage" },
      "task-2": { id: "task-2", content: "Watch my favorite show" },
      "task-3": { id: "task-3", content: "Charge my phone" },
      "task-4": { id: "task-4", content: "Cook dinner" },
    },
    columns: {
      "column-1": {
        id: "column-1",
        title: "To do",
        taskIds: ["task-1", "task-2", "task-3", "task-4"],
      },
    },
    // Facilitate reordering of the columns
    columnOrder: ["column-1"],
  };

  const onDragEnd = (result) => {};

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];
          const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
          return (
            <Column key={column.id} column={column} tasks={tasks}></Column>
          );
        })}
      </DragDropContext>
    </>
  );
}

export default VoteDisplay;
