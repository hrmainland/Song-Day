import { Box, Input, IconButton} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar() {
  return (
    <Box
          sx={{
            borderRadius: "20px",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            padding: "0px 8px",
            display: "flex",
            alignItems: "left",
            maxWidth: "500px",
          }}
        >
          <Input
            placeholder="Search"
            disableUnderline
            fullWidth
            sx={{ color: "inherit", fontSize: "1rem" }}
          />
          <IconButton sx={{ p: "6px" }}>
            <SearchIcon />
          </IconButton>
        </Box>
  )
}
