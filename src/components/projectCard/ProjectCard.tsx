import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import communityImpact from "../../assets/communityImpact.svg";
import peoplesChoice from "../../assets/peoplesChoice.svg";
import topExcellence from "../../assets/topExcellence.svg";

import DefaultProjectImage from "../../assets/DefaultProjectImage.svg";

import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  semester: string;
  image: string;
  teamname: string;
  category: string;
  likes: number;
  badges: string;
  projectId: string;
}

const ProjectCard = ({
  title,
  semester,
  image,
  teamname,
  category,
  likes,
  badges,
  projectId,
}: Props) => {
  const handleDefaultImage = (e: any) => {
    e.target.onerror = null;
    e.target.src = DefaultProjectImage;
  };
  let colour = "lightgrey";
  let awardText = "";
  let awardIcon = null;

  const setBadge = (badges: string) => {
    if (badges === "Community Impact") {
      colour = "#00E676";
      awardText = "Community Impact Award";
      awardIcon = communityImpact;
    } else if (badges === "Top Excellence") {
      colour = "#FFCA28";
      awardText = "Top Excellence Award";
      awardIcon = topExcellence;
    } else if (badges === "Peoples Choice") {
      colour = "#F44336";
      awardText = "People's Choice Award";
      awardIcon = peoplesChoice;
    }
  };

  setBadge(badges);

  const navigate = useNavigate();

  const handleCardClick = () => {
    // console.log("clicked");
    // console.log(projectId);

    navigate(`/project/${projectId}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        minWidth: 320,
        maxWidth: 320,
        border: "none",
        ":hover": {
          boxShadow: 10,
        },
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          alt="error loading image"
          height="125px"
          src={image}
          onError={handleDefaultImage}
        />
        <Box bgcolor={colour} height="8px" />

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
                <img src={awardIcon}></img>
              </Box>
            )}
            <Box display="grid">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 0.4, fontSize: "10px" }}
              >
                {semester}
              </Typography>
              <Typography noWrap variant="h5" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
              <Typography
                variant="body2"
                marginBottom="1.5em"
                sx={{ lineHeight: 0.4, fontSize: "10px", color: colour }}
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
              <FavoriteIcon color="error" fontSize="small" />
              <Typography
                variant="body2"
                color="error"
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
  );
};

export default ProjectCard;
