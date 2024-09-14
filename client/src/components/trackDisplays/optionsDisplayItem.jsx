import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

export default function OptionsDisplayItem({ track, addFunc, index }) {
  if (track.name.length > 60) {
    track.name = track.name.substring(0, 59) + "…";
  }
  if (track.artists.length > 30) {
    track.artists = track.artists.substring(0, 29) + "…";
  }

  const handleAdd = () => {
    addFunc(track, index);
  };

  return (
    <>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="add">
            <AddIcon />
          </IconButton>
        }
        onClick={handleAdd}
        sx={{cursor:"pointer"}}
      >
        <ListItemAvatar>
          <Avatar
            src={track.img}
            variant="square"
            sx={{ width: 50, height: 50, paddingRight: "5px" }}
          />
        </ListItemAvatar>
        <ListItemText primary={track.name} secondary={track.artists} />
      </ListItem>
    </>
  );
}

