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
    // <Box sx={{ width: 600 }}>
    //   <form onSubmit={onSubmit}>
    //     <textarea
    //       className="comment-form-textarea"
    //       value={text}
    //       onChange={(e) => setText(e.target.value)}
    //     />

    //     <button className="comment-form-button" disabled={isTextAreaDisabled}>
    //       {submitLabel}
    //     </button>
    //   </form>
    // </Box>

    // Added styles to make it consistent with mui
    <Box 
      sx={{ width: 600 }} component={'form'}
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