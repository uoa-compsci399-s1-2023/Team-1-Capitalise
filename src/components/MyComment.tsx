// this is for rendering a comment

import { Container, Box, Typography } from "@mui/material";
import { getUserbyId, TUser } from "../api/getUserbyId";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../customHooks/useAuth";
import { API_URL } from "../api/config";

interface Comment {
  commentId: string;
  userId: string;
  commentBody: string;
  parentId?: string;
  createdAt: string;
}

interface CommentProps {
  comment: Comment;
  replies: Comment[];
}

const MyComment: React.FC<CommentProps> = ({ comment, replies }) => {
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

  const deleteComment = async (commentId: string) => {
    const token = auth.getToken();
    if (token) {
      if (window.confirm("Are you sure you want to remove comment?")) {
        fetch(`${API_URL}/api/projects/comment/${commentId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            commentId: "643e2fbca5ec12d8d7e14d3d",
          }),
        })
          .then((response) => response.json())
          .then((response) => console.log(JSON.stringify(response)));
      }
    }
  };

  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  // we set the user associated with the comment we want to display
  const [user, setUser] = useState<TUser | undefined>();
  let { userId } = useParams();

  // grab the user associated with the comment
  useEffect(() => {
    const fetchUsername = async () => {
      // hard coded atm, but will link to real users later.
      // did this since mock user won't work with getUserbyId API
      const newUser = await getUserbyId("6432f85f6cce2fc1706572cf"); // this is my UPI
      setUser(newUser);

      // check the user
      // console.log("Current comment author:", newUser.username);
    };
    fetchUsername();
  }, [userId]);

  return (
    <div className="comment">
      <div className="comment-image-container">
        {/* will be able to chuck in user.profilePicture when we're dealing with actual users */}
        <img
          src="src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg"
          width="30"
          height="30"
        />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          {/* will be able to chuck in user.username when we're dealing with actual users */}
          <div className="comment-author">{comment.userId}</div>
          <div>{createdAt}</div>
        </div>
        <Typography variant="body1" color="initial" fontWeight={100}>
          {comment.commentBody}
        </Typography>
        <div className="comment-actions">
          <div className="comment-action">
            <input type="button" onClick={handleReply} value="Reply" />
          </div>

          {auth.isAllowed(["graduate", "admin"]) &&
            auth.user?._id == comment.userId && (
              <input type="button" onClick={handleDelete} value="Delete" />
            )}
        </div>
        {replies.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <MyComment comment={reply} key={reply.commentId} replies={[]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComment;
