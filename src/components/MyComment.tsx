// this is for rendering a comment

import { Container, Box, Typography, Button } from "@mui/material";
import { getUserbyId, TUser } from "../api/getUserbyId";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../customHooks/useAuth";
import { API_URL } from "../api/config";

import ReplyIcon from "@mui/icons-material/Reply";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { TComment } from "../api/getComments";

interface CommentProps {
  comment: TComment;
}

const MyComment: React.FC<CommentProps> = ({ comment }) => {
  const auth = useAuth();

  // need to put logic to handle replies
  const handleReply = () => {
    auth.onlyAuthenticated(); // checks if the user is signed in and redirects if otherwise
    if (auth.user) {
      console.log(auth.user._id, "can reply");
    }
  };

  // need to put logic to handle comment deletion
  const handleDelete = () => {
    auth.onlyAuthenticated(); // checks if the user is signed in and redirects if otherwise
    if (auth.user) {
      console.log(auth.user._id, "is logged in");
      if (auth.user._id == comment.userId) {
        console.log(
          auth.user._id,
          "is the author of the comment and can delete it"
        );
      }
    }
  };

  const deleteComment = async () => {
    const token = auth.getToken();
    if (token) {
      if (window.confirm("Are you sure you want to remove comment?")) {
        fetch(`${API_URL}/api/projects/comment/${comment._id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            commentId: comment._id,
          }),
        })
          .then((response) => response.json())
          .then((response) => console.log(JSON.stringify(response)));
      }
      // reload the page to show the changes
      // location.reload();
    }
  };

  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  // we set the user associated with the comment we want to display
  const [user, setUser] = useState<TUser | undefined>();
  let { userId } = useParams();

  // grab the user associated with the comment
  useEffect(() => {
    const fetchUsername = async () => {
      const newUser = await getUserbyId(comment.user); // when i used comment.userId it didn't work
      setUser(newUser);
    };
    fetchUsername();
  }, [userId]);

  return (
    <div className="comment">
      <div className="comment-image-container">
        {/* will be able to chuck in user.profilePicture when we're dealing with actual users */}
        <img src={user?.profilePicture} width="30" height="30" />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          {/* will be able to chuck in user.username when we're dealing with actual users */}
          <div className="comment-author">{user?.name}</div>
          <div className="comment-date">{createdAt}</div>
        </div>
        <Typography variant="body1" color="initial" fontWeight={100}>
          {comment.commentBody}
        </Typography>
        <div className="comment-actions">
          <div className="comment-action">
            {auth.isAllowed(["graduate", "admin", "visitor"]) &&
              auth.user?._id == comment.user && (
                <Button
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={deleteComment}
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
