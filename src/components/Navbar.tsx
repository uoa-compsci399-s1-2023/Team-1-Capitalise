import * as React from 'react';
import { AppBar, Box, Button, Menu, Toolbar, styled } from "@mui/material";
import {Routes, Route, useNavigate, Navigate} from 'react-router-dom';
import Logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import zIndex from "@mui/material/styles/zIndex";
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';

const pages = ['About', 'Projects'];


const StyledToolBar = styled(Toolbar)({
  height: "75px",
  width: "100vw",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px",
});
const StyledLink = styled(Link)({
  display: 'block',
  padding: '25px',
  color: '#3c3c3c',
  textDecoration: 'none',
  fontSize: 15,
  '&:hover': {
    backgroundColor: '#c0e4ff',
  },
});

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  
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
    const navigate = useNavigate();
    const goToPage = (pageName: any) => {
      navigate('/' + pageName);
    };
  
  return (
    <AppBar position="static" sx={{ bgcolor: "white", zIndex: "100" }}>
      <Container maxWidth= {false} disableGutters>
        <StyledToolBar>
          <Box height="100%" display="flex" gap="25px" >
            
            <Box gap = "25px" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => {
                    handleCloseNavMenu();
                    goToPage(page);
                    }}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Link to="/">
              <img
                src={Logo}
                alt="logo"
                height="100%"
                style={{ verticalAlign: "middle" }}
              ></img>
            </Link>
            {/* The nav barpage links*/}
            
            <Box sx={{ justifyContent: "center", alignItems: "center",flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
            {pages.map((page) => (
              <Button 
                key={page}
                onClick={() => {
                  handleCloseNavMenu();
                  goToPage(page);
                  }}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page}
              </Button>
            ))}
            </Box>
            
          </Box>
          <Box gap="20px" sx={{ justifyContent: "right", flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
              <SearchBar />
              <Button variant="outlined">Log in</Button>
              <Button variant="contained">Sign up</Button>
            </Box>
          {/* This is for the left hand side of the Nav Bar*/}
          
          
        </StyledToolBar>
      </Container>
    </AppBar>
  );
};  

export default ResponsiveAppBar;
