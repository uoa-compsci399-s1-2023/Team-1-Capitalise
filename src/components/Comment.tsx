import { Container, Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

// CommentProps to pass what the Comment component will accept.
// NOTE: i may pass additional props to the Comment component like date and user who posted.
interface CommentProps {
  text: string;
}

const Comment: React.FC<CommentProps> = ({ text }) => {
  return (
    <Typography variant="body1" color="textSecondary">
      {text}
    </Typography>
  );
};

export default Comment;
