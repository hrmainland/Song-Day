/* eslint-disable no-undef */
import {
  Box,
  Container,
  Grid,
} from "@mui/material";
import Navbar from "../components/navbar";

export default function Template() {
  return (
    <>
      <Navbar></Navbar>
      <Container
        fixed
        className="top-container"
        sx={{
          mt: 5,
        }}
      >
        <Box display="flex" justifyContent="center">
          <Grid container maxWidth={600}>
            <Grid item xs={12}>
              hello
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

