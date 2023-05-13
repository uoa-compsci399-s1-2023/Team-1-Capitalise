import { Box, Button, Collapse, Fade, Slide, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";
import MuiCarousel from "react-material-ui-carousel";
import { useEffect, useState } from "react";
import { getHeroBanners } from "../../api/getHeroBanners";

const Hero = () => {
  //delete this in final
  const [heroBanners, setHeroBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStudent, setIsStudent] = useState(false);
  const [hasProject, setHasProject] = useState(false);
  const [loggedInAdmin, setLoggedInAdmin] = useState(0);
  const auth = useAuth();
  useEffect(() => {
    const fetchHeroBanners = async () => {
      const respData = await getHeroBanners();
      if (respData.length !== 0) {
        setHeroBanners(respData);
        setIsLoading(false);
      }
    };
    fetchHeroBanners();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      if (auth.user) {
        if (auth.user.userType == "graduate" || auth.user.userType == "admin") {
          setIsStudent(true);
          if (auth.user.project) {
            setHasProject(true);
          }
        }
        //delete in final
        if (auth.user.userType === "admin") {
          setLoggedInAdmin(1000);
        }
        //delete in final end
      } else {
        setIsStudent(false);
        setHasProject(false);
      }
    };
    checkAuth();
  }, [auth]);
  return (
    <Box position="relative">
      {!isLoading && (
        <MuiCarousel
          indicators={false}
          navButtonsAlwaysInvisible={true}
          swipe={false}
        >
          {heroBanners.map((banner) => (
            <Box
              display="flex"
              width="100%"
              height={{ xs: "350px", lg: "400px", xl: "500px" }}
              component="img"
              src={banner}
              alt="hero"
              alignSelf="center"
              sx={{ objectFit: "cover" }}
            ></Box>
          ))}
        </MuiCarousel>
      )}
      {!isLoading && (
        <Box>
          <Slide in={true} timeout={loggedInAdmin}>
            <Box
              width={{ xs: "95%", sm: "85%", md: "70%" }}
              position="absolute"
              zIndex={1}
              top={0}
              padding={{ xs: 4, lg: 10 }}
            >
              <Box>
                {!isStudent && (
                  <Box width="100%">
                    <Box>
                      <Typography variant="h1" color="white" fontWeight={400}>
                        {"Explore the talent at UoA"}
                      </Typography>
                      <Typography
                        variant="h4"
                        color="white"
                        paddingTop="50px"
                        fontWeight={200}
                      >
                        {
                          "We are proud to showcase the exceptional skills of our students."
                        }
                      </Typography>
                    </Box>
                    <Box paddingTop="25px">
                      <Link to="../projects">
                        <Button variant="contained" color="primaryDark">
                          {"Explore Projects"}
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                )}
                {isStudent && (
                  <Box>
                    <Box>
                      <Typography variant="h4" color="white" fontWeight={200}>
                        {`Welcome ${auth.user?.name}!`}
                      </Typography>
                      <Typography
                        variant="h1"
                        color="white"
                        fontWeight={400}
                        paddingTop="5px"
                      >
                        {"Make the most of your capstone project"}
                      </Typography>
                      {hasProject && (
                        <Typography
                          variant="h4"
                          fontWeight={200}
                          color="white"
                          paddingTop="40px"
                        >
                          {"View your project"}
                        </Typography>
                      )}
                      {!hasProject && (
                        <Typography
                          variant="h4"
                          fontWeight={200}
                          color="white"
                          paddingTop="40px"
                        >
                          {
                            "Upload your project and connect with potential employers."
                          }
                        </Typography>
                      )}
                    </Box>
                    {hasProject && (
                      <Box paddingTop="20px">
                        <Link to={`../projects/${auth.user?.project}`}>
                          <Button variant="contained" color="primaryDark">
                            Your Project
                          </Button>
                        </Link>
                      </Box>
                    )}
                    {!hasProject && (
                      <Box paddingTop="20px">
                        <Link to="../upload">
                          <Button variant="contained" color="primaryDark">
                            Upload
                          </Button>
                        </Link>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Slide>
        </Box>
      )}
    </Box>
  );
};

export default Hero;
