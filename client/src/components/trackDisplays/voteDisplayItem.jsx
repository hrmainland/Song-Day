import { ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import * as React from "react";

const VoteDisplayItem = React.forwardRef(({ track, ...props }, ref) => (
  <ListItem ref={ref} {...props}>
    <ListItemAvatar>
      <Avatar
        src={track.img}
        variant="square"
        sx={{ width: 50, height: 50, paddingRight: "5px" }}
      />
    </ListItemAvatar>
    <ListItemText primary={track.name} secondary={track.artists} />
  </ListItem>
));

export default VoteDisplayItem;
