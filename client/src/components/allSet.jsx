import React from "react";
import { Box, Typography } from "@mui/material";
import CenterBox from "./base/centerBox";

export default function AllSet({}) {
  return (
    <CenterBox maxWidth="1000px">
      <Typography variant="h4" sx={{ mt: 4, mx: 2 }}>
        You're all set
      </Typography>
      <Typography variant="body1" sx={{ my: 2, mx:2}}>
        You're good to go, the host is able to create the playlist once everyone has voted.
      </Typography>
      <CenterBox maxWidth="500px">
        <img src="/park.svg" alt="park" />
      </CenterBox>
    </CenterBox>
  );
}
