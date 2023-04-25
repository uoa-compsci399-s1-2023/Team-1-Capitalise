import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import MyComment from "./MyComment";

const CommentForm = ({ handleSubmit, submitLabel }) => {
  const [text, setText] = useState("");
  const isTextAreaDisabled = text.length == 0;

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(text); // we are just calling the addComment function defined in Comments
    setText("");
  };

  return (
    <Box sx={{ width: 600 }}>
      <form onSubmit={onSubmit}>
        <textarea
          className="comment-form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button className="comment-form-button" disabled={isTextAreaDisabled}>
          {submitLabel}
        </button>
      </form>
    </Box>
  );
};

export default CommentForm;