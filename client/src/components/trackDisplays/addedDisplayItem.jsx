import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function AddedDisplayItem({ track, removeFunc }) {
  if (track.name.length > 60) {
    track.name = track.name.substring(0, 59) + "…";
  }
  if (track.artists.length > 30) {
    track.artists = track.artists.substring(0, 29) + "…";
  }

  const handleDelete = () => {
    removeFunc(track);
  };

  return (
    <>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        }
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

export default AddedDisplayItem;
