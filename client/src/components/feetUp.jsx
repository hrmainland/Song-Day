import React from "react";
import { Box, Typography } from "@mui/material";
import CenterBox from "./base/centerBox";

export default function FeetUp({ }) {
  return (
    <CenterBox maxWidth="1000px">
      <Typography variant="h4" sx={{ mt: 4, mx: 2 }}>
        Put your feet up
      </Typography>
      <Typography gutterTop variant="body1" sx={{ my: 2, mx:2}}>
        You'll be able to vote here once everyone has submitted their songs
      </Typography>
      <CenterBox maxWidth="500px">
        <img src="/hammock.svg" alt="hammock" />
      </CenterBox>
    </CenterBox>
  );
}
