import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
} from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import * as React from "react";

export default function ShortlistDisplayItem({ track, index, removeFunc }) {
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
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="remove"
                onClick={() => removeFunc(track, index)}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            }
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

