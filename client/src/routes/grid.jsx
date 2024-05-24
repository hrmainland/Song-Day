import { Container, Grid, Button } from "@mui/material";

function MyGrid() {
  return (
    <Grid container spacing={2} justifyContent="center" sx={{ border: 1 }}>
      <Grid item className="red" xs={12} sm={8} md={6}></Grid>
    </Grid>
  );
}

export default MyGrid;
