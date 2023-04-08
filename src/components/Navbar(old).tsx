import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Menu,
  Toolbar,
  Tooltip,
  styled,
} from "@mui/material";

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";

const pages = ["About", "Projects"];
const settings = ["Login", "Register"];

const StyledToolBar = styled(Toolbar)({
  height: "8vh",
  // width: "100vw",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px",
});

const NavButtons = styled(Button)({
  my: 2,
  color: "black",
  display: "block",
  fontSize: 16,
  fontFamily: "Roboto",
  fontWeight: 400,
});
{/*Navigation Bar*/ }
function ResponsiveAppBar() {
  {/*Functionality for opening/closing sidebar*/ }
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  {/*Navigation Functionality + Routing*/ }
  const navigate = useNavigate();
  const goToPage = (pageName: any) => {
    navigate("/" + pageName);
  };
  {/*App Bar*/ }
  return (
    <Box >
      <AppBar position="sticky" sx={{ bgcolor: "white", zIndex: "100" }}>
          <StyledToolBar>
            {/*Desktop Logo*/}
            <Box height="100%" display="flex">
              <Link to="/">
                <Box
                  component="img"
                  src={Logo}
                  alt="logo"
                  // padding="5px 100px"
                  sx={{
                    flexGrow: 1,
                    height: "100%",
                    display: { xs: "none", md: "flex" },
                  }}
                ></Box>
              </Link>
              {/*This is the side bar for mobile*/}
              <Box
                gap="25px"
                sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => {
                        handleCloseNavMenu();
                        goToPage(page);
                      }}
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              {/*Mobile Logo*/}
              <Link to="/">
                <Box
                  component="img"
                  src={Logo}
                  alt="logo"
                  sx={{
                    flexGrow: 1,
                    // padding: "5px 100px",
                    height: "100%",
                    display: { xs: "flex", md: "none" },

                  }}
                ></Box>
              </Link>

              {/* The nav barpage links*/}
              <Box
                gap="50px"
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                }}
              >
                {pages.map((page) => (
                  <NavButtons
                    key={page}
                    onClick={() => {
                      handleCloseNavMenu();
                      goToPage(page);
                    }}
                  >
                    {page}
                  </NavButtons>
                ))}
              </Box>
            </Box>
            {/* This is for the right hand side of the Nav Bar*/}
            <Box
              gap="20px"
              sx={{
                justifyContent: "right",
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
              }}
            >
              <SearchBar />
              <Button variant="outlined">Log in</Button>
              <Button variant="contained">Sign up</Button>
            </Box>
            {/*RHS for Mobile/Smaller Screens*/}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none"}, justifyContent: 'flex-end'}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Not Logged In" src="" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          </StyledToolBar>
      </AppBar>
    </Box>

  );
}

export default ResponsiveAppBar;
