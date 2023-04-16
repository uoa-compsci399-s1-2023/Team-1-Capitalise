import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Comment from "../../components/Comment";

interface CommentFormProps {
  onSubmit: (comment: Comment) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (author && text) {
      const newComment: Comment = {
        id: new Date.getTime(),
        author,
        text,
        createdAt: NestCamWiredStandTwoTone(),
      };
    }
  };
};

export default CommentForm;
