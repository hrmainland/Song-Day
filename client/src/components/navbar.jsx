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

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';

import HeadphonesIcon from '@mui/icons-material/Headphones';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import { Link } from 'react-router-dom';

import LoginDialog from './loginDialog';

export default function Navbar() {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  const handleLoginOpen = () => {
    setLoginDialogOpen(true);
  };
  
  const handleLoginClose = () => {
    setLoginDialogOpen(false);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper', 
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          py: 0.5
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xxs: '64px' } }}>
            {/* Mobile menu button */}
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ 
                mr: 2, 
                display: { xxs: 'flex', md: 'none' },
                color: 'text.primary'
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mr: 2
              }}
              component={Link}
              to="/"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  height: 40,
                  width: 40,
                  mr: 1.5,
                  display: { xxs: 'none', sm: 'flex' }
                }}
              >
                <HeadphonesIcon />
              </Avatar>
              <Typography 
                variant="h5" 
                component="div"
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  letterSpacing: '-0.5px',
                  fontSize: { xxs: '1.3rem', sm: '1.5rem' }
                }}
              >
                SongDay
              </Typography>
            </Box>
            
            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xxs: 'none', md: 'flex' } }}>
              <Button 
                sx={{ 
                  my: 2, 
                  color: 'text.secondary',
                  mx: 1,
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Home
              </Button>
              <Button 
                sx={{ 
                  my: 2, 
                  color: 'text.secondary',
                  mx: 1,
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                My Sessions
              </Button>
            </Box>
            
            {/* Profile Button */}
            <Box sx={{ flexGrow: 0 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<AccountCircleIcon />}
                onClick={handleLoginOpen}
                sx={{ 
                  borderRadius: '30px',
                  px: { xxs: 2, sm: 3 },
                  boxShadow: '0 2px 8px rgba(64,126,160,0.2)'
                }}
              >
                Login
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Login Dialog */}
      <LoginDialog open={loginDialogOpen} onClose={handleLoginClose} />
    </ThemeProvider>
  );
}
