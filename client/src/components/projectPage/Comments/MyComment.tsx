// this is for rendering a comment

import {
  Container,
  Box,
  Typography,
  Button,
  colors,
  Avatar,
} from "@mui/material";
// import { getUserbyId, TUser } from "../api/getUserbyId";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../../../customHooks/useAuth";
import { API_URL } from "../../../api/config";

import ReplyIcon from "@mui/icons-material/Reply";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { TComment } from "../../../model/TComment";

interface CommentProps {
  comment: TComment;
  deleteComment: (commentId: string) => void;
}

// try passing the deleteComment function into the MyComment prop

const MyComment: React.FC<CommentProps> = ({ comment, deleteComment }) => {
  const auth = useAuth();

  // need to put logic to handle replies
  const handleReply = () => {
    auth.onlyAuthenticated(); // checks if the user is signed in and redirects if otherwise
    if (auth.user) {
      console.log(auth.user._id, "can reply");
    }
  };

  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  return (
    // <div key={comment._id} className="comment">
    <div className="comment">
      <div className="comment-image-container">
        {/* will be able to chuck in user.profilePicture when we're dealing with actual users */}
        <Link to={`../user/${comment.user._id}`}>
          <Avatar
            src={comment.user.profilePicture}
            imgProps={{ referrerPolicy: "no-referrer" }}
          />
        </Link>
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          {/* will be able to chuck in user.username when we're dealing with actual users */}
          <Link to={`../user/${comment.user._id}`}>
            <div className="comment-author">{comment.user.name}</div>
          </Link>
          <Link to={`../projects/${comment.project}`}>
            <div className="comment-date">{createdAt}</div>
          </Link>
        </div>
        <Typography variant="body1" fontWeight={100}>
          {comment.commentBody}
        </Typography>
        <div className="comment-actions">
          <div className="comment-action">
            {auth.isAllowed(["graduate", "admin", "visitor"]) &&
              (auth.user?._id == comment.user._id || auth.user?.userType == "admin") && (
                <Button
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => deleteComment(comment._id)}
                  size="small"
                  color="error"
                >
                  Delete
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComment;
