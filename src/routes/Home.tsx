import Logo from "../assets/Logo.svg";
import Navbar from "../components/Navbar";
import { useEffect, useState, useContext } from "react";
import { Box, Stack, keyframes, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SearchContext, getDefaultFilters } from "../app";

function Home() {
  //dw about this just the spinny logo START
  // const [logoVisability, setLogoVisability] = useState(false);

  // const handleImageClick = () => {
  //   setLogoVisability(!logoVisability);
  // };

  // const AnimatedImg = styled("img")({
  //   "@keyframes spin": {
  //     from: {
  //       transform: "rotate(0deg)",
  //     },
  //     to: {
  //       transform: "rotate(360deg)",
  //     },
  //   },
  //   height: "7.5em",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   animation: "spin infinite 20s linear",
  //   opacity: `${logoVisability ? "100%" : "0%"}`,
  // });
  // //dw about this just the spinny logo END

  // return (
  //   <Box mt="8vh">
  //     <Box
  //       minHeight="92vh"
  //       display="flex"`
  //       justifyContent="center"
  //       alignItems="center"
  //     >
  //       <AnimatedImg
  //         src={Logo}
  //         alt="logo"
  //         onClick={handleImageClick}
  //       ></AnimatedImg>
  //     </Box>
  //   </Box>
  // );

  // Temp redirect till we make a landing page
  const { currFilters, setFilters } = useContext(SearchContext);
  const nav = useNavigate();

  useEffect(() => {
    setFilters(getDefaultFilters());
    nav('/Projects')
  }, [])
  return (<></>)
}

export default Home;
