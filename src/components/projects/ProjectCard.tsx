import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Fade from "@mui/material/Fade";
import DefaultProjectImage from "../../assets/DefaultProjectImage.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";
import { useContext } from "react";
import { AwardTypeContext } from "../../app";

interface Props {
  title: string;
  semester: string;
  image: string;
  teamname: string;
  category: string;
  likes: number;
  badges: string;
  projectID: string;
}

const ProjectCard = ({
  title,
  semester,
  image,
  teamname,
  category,
  likes,
  badges,
  projectID,
}: Props) => {
  const handleDefaultImage = (e: any) => {
    e.target.onerror = null;
    e.target.src = DefaultProjectImage;
  };
  const theme = useTheme();
  const awardTypes = useContext(AwardTypeContext);
  let gradientColours = ["lightgrey", "lightgrey"];
  let awardText = "";
  let awardIcon = null;

  //delete in final build
  let loggedInAdmin = 0;
  const auth = useAuth();
  if (auth.user) {
    if (auth.user._id === "6432f8826cce2fc1706572d3") {
      loggedInAdmin = 1000;
    }
  }
  //delete end

  const setBadge = (badges: string) => {
    if (badges !== "default") {
      for (const awardType of awardTypes) {
        if (awardType.value === badges) {
          gradientColours = awardType.gradient;
          awardText = awardType.value + " Award";
          awardIcon = awardType.image;
        }
      }
    }
  };

  setBadge(badges);

  return (
    <Fade in={true} timeout={loggedInAdmin}>
      <Card
        sx={{
          minWidth: 320,
          maxWidth: 320,
          border: "none",
          ":hover": {
            boxShadow: 10,
          },
        }}
      >
        <CardActionArea component={Link} to={`../projects/${projectID}`}>
          <CardMedia
            component="img"
            alt="error loading image"
            height="125px"
            src={image}
            onError={handleDefaultImage}
          />
          <Box
            height="8px"
            sx={{
              background: `linear-gradient(to right, ${gradientColours[0]}, ${gradientColours[1]})`,
            }}
          />

          <CardContent
            sx={{
              paddingTop: "15px",
              paddingBottom: "13px",
              "&:last-child": {
                paddingTop: "15px",
                paddingBottom: "13px",
              },
            }}
          >
            <Box display="flex">
              {awardIcon && (
                <Box paddingRight="10px">
                  <img src={awardIcon} width="40px"></img>
                </Box>
              )}
              <Box display="grid">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1, fontSize: "12px" }}
                >
                  {semester}
                </Typography>
                <Typography
                  noWrap
                  variant="h5"
                  sx={{ lineHeight: 1, fontWeight: 600 }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body2"
                  marginBottom="0.9em"
                  height="14px"
                  sx={{
                    fontSize: "12px",
                    background: `linear-gradient(to right, ${gradientColours[0]}, ${gradientColours[0]})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {awardText}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="end">
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.5}
                  fontSize="12px"
                >
                  {teamname}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  lineHeight={1}
                  fontSize="12px"
                >
                  {category}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="end"
                gap="2px"
                paddingBottom="0.35em"
              >
                <FavoriteIcon
                  sx={{ color: theme.customColors.likes }}
                  fontSize="small"
                />
                <Typography
                  variant="body2"
                  color={theme.customColors.likes}
                  fontSize="1.25em"
                  lineHeight={1}
                >
                  {likes}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Fade>
  );
};

export default ProjectCard;
