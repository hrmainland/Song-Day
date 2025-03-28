import React from 'react';
import { Box, Typography } from '@mui/material';
import HeaderButtons from './headerButtons';


export default function NoSessionsBox({onCreateClick, onJoinClick}) {
  return (
    <Box 
    display={"flex"} 
    flexDirection={"column"} 
    alignItems={"center"}
    sx={{maxWidth: "700px", mx: "auto", mb: "120px", mt: 2}} >
      <img src="/island-animated.svg" alt="island" />
      <Typography variant="h4" sx={{ mt: 2 }}>No sessions yet</Typography>
      <Typography gutterTop variant="body1" sx={{ mt: 2, mb:3 }}>
        Click below to get involved
      </Typography>
      <HeaderButtons 
            onCreateClick={onCreateClick} 
            onJoinClick={onJoinClick} 
          />
    </Box>
  )
}
