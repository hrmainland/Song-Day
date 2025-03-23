// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import { useNavigate } from "react-router-dom";
// // import MenuIcon from "@mui/icons-material/Menu";

// export default function Navbar() {
//   const navigate = useNavigate();

//   const handleHome = () => {
//     navigate("/home");
//   };

//   const handleLogin = () => {
//     navigate("/login");
//   };

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static">
//         <Toolbar sx={{ backgroundColor: "black" }}>
//           <IconButton
//             size="large"
//             edge="start"
//             color="inherit"
//             aria-label="menu"
//             sx={{ mr: 2 }}
//             onClick={handleHome}
//             className="heading"
//           >
//             Song Day
//           </IconButton>
//           <Typography
//             variant="h6"
//             component="div"
//             sx={{ flexGrow: 1 }}
//           ></Typography>
//           <Button color="inherit" onClick={handleLogin}>
//             Login
//           </Button>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";

export default function Navbar() {
  return (
    <ThemeProvider theme={theme}>
    {/* <Box sx={{ flexGrow: 1 }}> */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SongDay
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    {/* </Box> */}
    </ThemeProvider>
  );
}
