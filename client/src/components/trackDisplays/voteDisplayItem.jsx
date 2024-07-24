import { ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import * as React from "react";

function VoteDisplayItem({ track, index }) {
  const { name, artists, img, _id } = track;
  const id = _id;

  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <ListItemAvatar>
              <Avatar
                src={img}
                variant="square"
                sx={{ width: 60, height: 60, paddingRight: "5px" }}
              />
            </ListItemAvatar>
            <ListItemText primary={name} secondary={artists} />
          </ListItem>
        )}
      </Draggable>
    </>
  );
}

export default VoteDisplayItem;
