import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  Toolbar,
  Tooltip,
  styled,
  useRadioGroup,
} from "@mui/material";

import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import DefaultPFP from "../assets/DefaultPfp.svg";
import SearchBar from "./SearchBar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import validator from "validator";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  AppRegistration,
  Login,
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useAuth } from "../customHooks/useAuth";
import { useState } from "react";

//Navigation Tabs
const pages = ["About", "Projects"];

//Pages without Navigation Bars
const NoNavPages = [
  "/register",
  "/login",
  "/googleSuccessRedirect",
  "/googleFailure",
  "/ResetPassword",
  "/changePassword",
];

const StyledToolBar = styled(Toolbar)({
  height: "8vh",
  padding: "2px 10%",
  color: "black",
});

const NavButton = styled(Button)({
  color: "black",
  display: "block",
  fontSize: 19,
  fontFamily: "Roboto",
  fontWeight: 400,
  textTransform: "capitalize",
});
const AuthButton = styled(Button)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  padding: "0 25px",
});

{
  /*Navigation Bar*/
}
function ResponsiveAppBar() {
  //Auth Header
  const auth = useAuth();

  //Fetch Current User (Check if Logged in)
  const uCheck = auth.user != null;

  // check if user is admin
  const isAdmin = auth.user?.userType == "admin";

  //Functionality for opening/closing sidebar
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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

  //Navigation Functionality + Routing

  const navigate = useNavigate();
  const goToPage = (pageName: any) => {
    navigate("/" + pageName);
  };

  // App bar
  if (NoNavPages.includes(window.location.pathname)) {
    return null;
  }
  return (
    <AppBar position="fixed" sx={{ bgcolor: "white" }}>
      <Container maxWidth="xl" disableGutters>
        <StyledToolBar disableGutters>
          {/*Desktop Logo*/}
          <Link to="/">
            <Box
              padding="0 30px"
              component="img"
              src={Logo}
              alt="logo"
              sx={{
                width: "200px",
                height: "auto",
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
              }}
            ></Box>
          </Link>

          {/* The nav barpage links*/}
          <Box
            gap="15px"
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <NavButton
                key={page}
                onClick={() => {
                  handleCloseNavMenu();
                  goToPage(page);
                }}
              >
                {page}
              </NavButton>
            ))}
          </Box>

          {/* This is for the right hand side of the Nav Bar*/}
          <Box
            gap="20px"
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            <SearchBar />
            {/* Check if User is logged in */}
            {uCheck &&
              (auth.user?.userType === "graduate" || auth.user?.userType === "admin") && [
                <Button
                  sx={{ padding: "0 25px" }}
                  key="upload"
                  variant="contained"
                  disabled={auth.user?.project && auth.user.userType != 'admin' ? true : false}
                  onClick={() => {
                    goToPage("upload");
                  }}
                >
                  Upload
                </Button>,
              ]}
            {uCheck
              ? [
                  <IconButton
                    key="profilepic"
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                  >
                    <Avatar alt="Logged In" src={auth.user?.profilePicture}>
                      {" "}
                      <img referrerPolicy="no-referrer" />
                    </Avatar>
                  </IconButton>,
                ]
              : [
                  <AuthButton
                    key="login"
                    onClick={() => {
                      goToPage("login");
                    }}
                    variant="outlined"
                  >
                    Log In
                  </AuthButton>,
                  <AuthButton
                    key="register"
                    onClick={() => {
                      goToPage("register");
                    }}
                    variant="contained"
                  >
                    {" "}
                    Sign Up{" "}
                  </AuthButton>,
                ]}
          </Box>

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
                width: "140px",
                height: "auto",
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
              }}
            ></Box>
          </Link>
          {/*RHS for Mobile/Smaller Screens*/}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              justifyContent: "right",
            }}
          >
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Logged In"
                  src={auth.user ? auth.user.profilePicture : DefaultPFP}
                  imgProps={{ referrerPolicy: "no-referrer" }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              /* Adjusting the dropdown options*/
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 2,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
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
              {/*The dropdown options*/}
              {uCheck && (
                <Box>
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate(`../user/${auth.user?._id}`);
                    }}
                  >
                    {/*If User is logged in, render his name*/}
                    <Avatar
                      key="userAva"
                      // Yathi - Added referrerPolicy for google
                      imgProps={{ referrerPolicy: "no-referrer" }}
                      src={auth.user?.profilePicture}
                    ></Avatar>
                    {auth.user?.name}
                  </MenuItem>
                  <Divider />
                </Box>
              )}

              {uCheck &&
                auth.user?.userType === "graduate" || auth.user?.userType === "admin" && [
                  <MenuItem
                    disabled={auth.user?.project && !(auth.user?.userType == 'admin') ? true : false}
                    key="upload"
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate("/upload");
                    }}
                  >
                    <ListItemIcon>
                      <UploadFileIcon fontSize="small" />
                    </ListItemIcon>
                    Upload Project
                  </MenuItem>,
                ]}

              {/*CHeck if isAdmin for dashboard*/}

              {uCheck &&
                isAdmin && [
                  <MenuItem
                    key="admin"
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate("/adminDashboard");
                    }}
                  >
                    <ListItemIcon>
                      <AdminPanelSettings fontSize="small" />
                    </ListItemIcon>
                    Admin Dashboard
                  </MenuItem>,
                ]}

              {/*Display settings based on login status*/}
              {uCheck
                ? [
                    <MenuItem
                      key="logout"
                      onClick={() => {
                        handleCloseUserMenu();
                        auth.signout();
                        navigate("/");
                      }}
                    >
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Log Out
                    </MenuItem>,
                  ]
                : //Or display guest (not logged in details)

                  [
                    <MenuItem
                      key="register2"
                      onClick={() => {
                        handleCloseUserMenu();
                        navigate("register");
                      }}
                    >
                      <ListItemIcon>
                        <AppRegistration fontSize="small" />
                      </ListItemIcon>
                      Register
                    </MenuItem>,
                    <MenuItem
                      key="login2"
                      onClick={() => {
                        handleCloseUserMenu();
                        goToPage("login");
                      }}
                    >
                      <ListItemIcon>
                        <Login fontSize="small" />
                      </ListItemIcon>
                      Login
                    </MenuItem>,
                  ]}
              {/*End of Check condition*/}
            </Menu>
          </Box>
        </StyledToolBar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
