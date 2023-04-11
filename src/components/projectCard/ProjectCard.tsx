import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import DefaultProjectImage from "../../assets/DefaultProjectImage.svg";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Props {
  title: string;
  semester: string;
  image: string;
  teamname: string;
  category: string;
  likes: number;
}

const ProjectCard = ({
  title,
  semester,
  image,
  teamname,
  category,
  likes,
}: Props) => {
  const handleDefaultImage = (e: any) => {
    e.target.onerror = null;
    e.target.src = DefaultProjectImage;
  };

  return (
    <Card sx={{ maxWidth: 320, width: 320, border: "none", boxShadow: "none" }}>
      <CardMedia
        component="img"
        alt="error loading image"
        height="110"
        src={image}
        onError={handleDefaultImage}
      />

      <Box bgcolor="lightgrey" height="8px" />

      <CardContent
        sx={{
          paddingTop: "12px",
          paddingBottom: "10px",
          "&:last-child": {
            paddingTop: "12px",
            paddingBottom: "10px",
          },
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 0.4, fontSize: "10px" }}
        >
          {semester}
        </Typography>
        <Typography gutterBottom variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
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
          <Box display="flex" alignItems="end" gap="2px" paddingBottom="0.35em">
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
    </Card>
  );
};

export default ProjectCard;
