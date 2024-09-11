import { Box } from "@mui/material";

function Session({ name, onClick }) {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          border: "1px solid",
          borderRadius: 1,
          p: 2,
          pt: 1,
          mt: 2,
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <h3>{name}</h3>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
      </Box>
    </>
  );
}

export default Session;
