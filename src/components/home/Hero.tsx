import {
  Box,
  Button,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";
import MuiCarousel from "react-material-ui-carousel";
import { useEffect, useState } from "react";
import { getHeroBanners, getMobileHeroBanners } from "../../api/getHeroBanners";

const Hero = () => {
  //delete this in final
  const [loggedInAdmin, setLoggedInAdmin] = useState(0);
  const [heroBanners, setHeroBanners] = useState([]);
  const [mobileHeroBanners, setMobileHeroBanners] = useState([]);
  const [isHeroLoading, setHeroIsLoading] = useState(true);
  const [isMobileHeroLoading, setMobileHeroIsLoading] = useState(true);
  const [isStudent, setIsStudent] = useState(false);
  const [hasProject, setHasProject] = useState(false);
  const [carouselHeight, setCarouselHeight] = useState("");
  const auth = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLg = useMediaQuery(theme.breakpoints.down("xl"));

  useEffect(() => {
    const fetchHeroBanners = async () => {
      const respData = await getHeroBanners();
      if (respData.length !== 0) {
        setHeroBanners(respData);
        setHeroIsLoading(false);
      }
    };
    const fetchMobileHeroBanners = async () => {
      const respData = await getMobileHeroBanners();
      if (respData.length !== 0) {
        setMobileHeroBanners(respData);
        setMobileHeroIsLoading(false);
      }
    };
    fetchHeroBanners();
    fetchMobileHeroBanners();
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCarouselHeight("400px");
    } else if (isLg) {
      setCarouselHeight("450px");
    } else {
      setCarouselHeight("500px");
    }
  }, [isMobile, isLg]);

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
        if (auth.user._id === "6432f8826cce2fc1706572d3") {
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
      {!isHeroLoading && !isMobile && (
        <MuiCarousel
          indicators={false}
          navButtonsAlwaysInvisible={false}
          swipe={false}
          interval={8000}
          height={carouselHeight}
        >
          {heroBanners.map((banner, i) => (
            <Box
              display="flex"
              width="100%"
              height={carouselHeight}
              component="img"
              src={banner}
              alt="hero"
              alignSelf="center"
              sx={{ objectFit: "cover", objectPosition: "center" }}
              key={i}
            ></Box>
          ))}
        </MuiCarousel>
      )}
      {!isMobileHeroLoading && isMobile && (
        <MuiCarousel
          indicators={false}
          navButtonsAlwaysInvisible={false}
          swipe={false}
          interval={8000}
          height={carouselHeight}
        >
          {mobileHeroBanners.map((banner, i) => (
            <Box
              display="flex"
              width="100%"
              height={carouselHeight}
              component="img"
              src={banner}
              alt="hero"
              alignSelf="center"
              sx={{ objectFit: "cover", objectPosition: "center" }}
              key={i}
            ></Box>
          ))}
        </MuiCarousel>
      )}
      {!isMobileHeroLoading && !isHeroLoading && (
        <Box>
          <Slide in={true} timeout={loggedInAdmin}>
            <Box
              width={{ xs: "100%", sm: "85%", md: "53%" }}
              position="absolute"
              zIndex={1}
              top={0}
              padding={{ xs: 4, md: 5, lg: 7, xl: 10 }}
            >
              <Box>
                {!isStudent && (
                  <Box width="100%">
                    <Box>
                      {auth.user?.name && (
                        <Typography variant="h4" color="white" fontWeight={200}>
                          {`Welcome ${auth.user?.name}!`}
                        </Typography>
                      )}

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
