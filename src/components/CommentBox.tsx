import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";
import MyButton from "../components/MyButton";

import { writeComment } from "../api/writeComment";

interface CommentBoxProps {
  onSubmit: (comment: string) => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    onSubmit(comment);
    setComment("");
  };

  // TextField and Button components used to create an input field for comment.
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <TextField
          label="Write a comment"
          variant="outlined"
          fullWidth
          value={comment}
          onChange={handleCommentChange}
        />
      </Grid>
      <Grid item>
        <MyButton variant="contained" onClick={handleCommentSubmit}>
          Post
        </MyButton>
      </Grid>
    </Grid>
  );
};

export default CommentBox;
