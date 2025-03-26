import React, { forwardRef } from 'react';
import { Box, Input, IconButton} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = forwardRef(( props, ref ) => {
  const { onClick } = props

  return (
    <Box
          onClick={onClick}
          sx={{
            borderRadius: "20px",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            paddingLeft: "20px",
            paddingRight: "10px",
            display: "flex",
            alignItems: "left",
            pt:"2px",
            pb:"2px",
          }}
        >
          <Input
            placeholder="Search"
            disableUnderline
            fullWidth
            inputRef={ref}
            inputMode="text"
            autoFocus
            sx={{ color: "inherit", fontSize: "1rem" }}
          />
          <IconButton sx={{ p: "6px" }}>
            <SearchIcon />
          </IconButton>
        </Box>
  )
});

export default SearchBar;

