import { Container, Button, Grid, Typography } from "@mui/material";
import Navbar from "./navbar";
import Session from "./session";

function Sessions() {
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Session></Session>
        <Session></Session>
        <Session></Session>
        <Session></Session>
      </Grid>
    </>
  );
}

export default Sessions;
