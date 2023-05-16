import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import MyComment from "./MyComment";

interface CommentFormProps {
  handleSubmit: (c: string) => void
  submitLabel: string
}

const CommentForm = ({ handleSubmit, submitLabel }: CommentFormProps) => {
  const [text, setText] = useState("");
  const isTextAreaDisabled = text.length == 0;

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    handleSubmit(text); // we are just calling the addComment function defined in Comments
    setText("");
  };

  return (
    // Added styles to make it consistent with mui
    <Box 
      sx={{ 
        width: {md: "600px", xs: '100%'}, 
        // flexDirection: {md: 'row', xs: 'column'}
      }}
      component={'form'}
      display={'flex'}
      alignItems={'center'}
      gap={2}
    >
        <TextField
          id="comment-input-field"
          value={text}
          onChange={(e) => setText(e.target.value)} 
          multiline
          placeholder="Enter comment..."
          fullWidth
        />

        <Button 
          // className="comment-form-button" 
          disabled={isTextAreaDisabled} 
          onClick={onSubmit}
          variant="contained"
          color="primary"
          sx={{height: '40px'}}
        >
          {submitLabel}
        </Button>
      {/* </form> */}
    </Box>
  );
};

export default CommentForm;