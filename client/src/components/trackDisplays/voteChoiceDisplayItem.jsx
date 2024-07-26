import { ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import * as React from "react";

function VoteChoiceDisplayItem({ track, index }) {
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
              <Avatar>{index + 1}</Avatar>
            </ListItemAvatar>
            <ListItemAvatar>
              <Avatar
                src={img}
                variant="square"
                sx={{ width: 50, height: 50, paddingRight: "5px" }}
              />
            </ListItemAvatar>
            <ListItemText primary={name} secondary={artists} />
          </ListItem>
        )}
      </Draggable>
    </>
  );
}

export default VoteChoiceDisplayItem;
