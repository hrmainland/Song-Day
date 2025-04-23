import React, { useState, useEffect, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import HeadphonesIcon from "@mui/icons-material/Headphones";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { ThemeProvider } from "@mui/material/styles";
import Divider from '@mui/material/Divider';

import theme from "../../utils/theme";
import { Link } from "react-router-dom";

import { isLoggedIn, logout } from "../../utils/apiCalls";
import DeleteAccountDialog from "./deleteAccountDialog";

import { UserContext } from "../context/userProvider";


export default function Navbar({ onLoginOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { userId, setUserId } = useContext(UserContext);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserId(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "background.paper",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          py: 0.5,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: "64px" } }}>
            {/* Mobile menu button */}
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                color: "text.primary",
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p:1,
                backgroundColor: theme.palette.primary.main,
                borderRadius: "12px",
              }}
              component={Link}
              to="/home"
              style={{ textDecoration: "none", color: "inherit" }}
            >

              <Box
                component="img"
                src="/Logo.svg"
                alt="Logo"
                sx={{
                  width: 40,
                  height: 40,
                }}
              />

                {/* <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    letterSpacing: "-0.5px",
                    fontSize: { xs: "1.3rem", sm: "1.5rem" },
                  }}
                >
                  Song Day
                </Typography> */}
              </Box>
            {/* </Box> */}

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                component={Link}
                to="/home"
                sx={{
                  my: 2,
                  color: "text.secondary",
                  mx: 1,
                  "&:hover": {
                    color: "primary.main",
                    backgroundColor: "transparent",
                  },
                }}
              >
                My Sessions
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                sx={{
                  my: 2,
                  color: "text.secondary",
                  mx: 1,
                  "&:hover": {
                    color: "primary.main",
                    backgroundColor: "transparent",
                  },
                }}
              >
                {/* logged in: {user.toString()} */}
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            {/* Profile Button - Always on far right */}
            <Box>
              {userId ? (
                <>
                  <IconButton
                    onClick={handleMenuClick}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      borderRadius: "30px",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      padding: "8px",
                      boxShadow: "0 2px 8px rgba(64,126,160,0.2)",
                    }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      "aria-labelledby": "account-button",
                    }}
                  >
                    <MenuItem onClick={() => {
                      handleLogout();
                      handleMenuClose();
                    }}>Logout</MenuItem>
                    <Divider />
                    <MenuItem 
                      onClick={() => {
                        setDeleteDialogOpen(true);
                        handleMenuClose();
                      }}
                      sx={{ 
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'error.contrastText'
                        }
                      }}
                    >
                      Delete Account
                    </MenuItem>
                  </Menu>
                  
                  <DeleteAccountDialog 
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                  />
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AccountCircleIcon />}
                  onClick={onLoginOpen}
                  sx={{
                    borderRadius: "30px",
                    px: { xs: 2, sm: 3 },
                    boxShadow: "0 2px 8px rgba(64,126,160,0.2)",
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
