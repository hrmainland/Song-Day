// MyComponent.js
import React from "react";
import baseUrl from "../../utils/urlPrefix";
import { Container, Grid, Button, Box } from "@mui/material";

function Pad() {
  return (
    <>
      <form action={`${baseUrl}/pad`} method="GET">
        <input type="hidden" name="bla" value="tody" />
        <Button type="submit">Submit</Button>
      </form>
      {/* <a href={`${baseUrl}/pad?name=tony`}>go</a> */}
    </>
  );
}

export default Pad;
