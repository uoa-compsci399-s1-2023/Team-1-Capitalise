import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Category } from "@mui/icons-material";

interface Props {
  title: string;
  semester: string;
  image: string;
  teamname: string;
  category: string;
}

const ProjectCard = ({ title, semester, image, teamname, category }: Props) => {
  return (
    <Card sx={{ maxWidth: 320, width: 320, border: "none", boxShadow: "none" }}>
      <CardMedia component="img" alt="image" height="110" image={image} />
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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.5, fontSize: "12px" }}
        >
          {teamname}
        </Typography>
        <Typography
          gutterBottom
          variant="body2"
          sx={{ lineHeight: 1, fontSize: "12px" }}
        >
          {category}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
