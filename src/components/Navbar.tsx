import { AppBar, Box, Button, Toolbar, styled } from "@mui/material";
import Logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const StyledToolBar = styled(Toolbar)({
  height: "75px",
  width: "100vw",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px",
});

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: "white", zIndex: "100" }}>
      <StyledToolBar>
        <Box height="100%" display="flex" gap="15px">
          <Link to="/">
            <img
              src={Logo}
              alt="logo"
              height="100%"
              style={{ verticalAlign: "middle" }}
            ></img>
          </Link>
          <Box
            display="flex"
            gap="15px"
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Link to="/projects">Projects</Link>
            <Link to="/about">About</Link>
          </Box>
        </Box>
        <Box display="flex" gap="10px">
          <SearchBar />
          <Button variant="outlined">Log in</Button>
          <Button variant="contained">Sign up</Button>
        </Box>
      </StyledToolBar>
    </AppBar>
  );
};

export default Navbar;
