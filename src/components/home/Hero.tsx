import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import heroImage from "../../assets/image-placeholderhomeplaceholder.png";

const Hero = () => {
  return (
    <Box position="relative">
      <Box
        display="flex"
        width="100%"
        height={{ xs: "350px", lg: "400px", xl: "500px" }}
        component="img"
        src={heroImage}
        alt="hero"
        alignSelf="center"
        sx={{ objectFit: "cover" }}
      ></Box>
      <Box position="absolute" zIndex={1} top={0} padding={{ xs: 4, lg: 10 }}>
        <Box width={{ xs: "100%", md: "70%" }}>
          <Typography variant="h1" color="white" fontWeight={8000}>
            Explore the talent at UoA
          </Typography>
          <Typography
            variant="h4"
            color="white"
            paddingTop="50px"
            fontWeight={200}
          >
            We are proud to showcase the exceptional skills of our students.
          </Typography>
        </Box>
        <Box paddingTop="25px">
          <Link to="../projects">
            <Button variant="contained">Explore Projects</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
