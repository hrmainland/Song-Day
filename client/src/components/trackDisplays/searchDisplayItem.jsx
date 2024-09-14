import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

export default function SearchDisplayItem({ track, addFunc }) {
  const { id, name, artists, img } = track;

  const handleClick = () => {
    addFunc(track);
  };

  return (
    <>
      <ListItem sx={{ cursor: "pointer" }} onClick={handleClick}>
        <ListItemAvatar>
          <Avatar
            src={img}
            variant="square"
            sx={{ width: 60, height: 60, paddingRight: "5px" }}
          />
        </ListItemAvatar>
        <ListItemText primary={name} secondary={artists} />
      </ListItem>
    </>
  );
}

