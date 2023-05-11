// similar to how we had dedicated Projects component for project display
import { useState, useEffect } from "react";
import { Container, Box, Typography } from "@mui/material";
import MyComment from "./MyComment";
import CommentForm from "./CommentForm";
import { useAuth } from "../../../customHooks/useAuth";

import { API_URL } from "../../../api/config";
import { TComment } from "../../../model/TComment";

interface CommentsProps {
  comments: TComment[];
  projectId?: string;
}

// so instead of passing in currentUserId for authentication, we just pass in the comments array of the current project.
// we handle auth through the useAuth rather than through the getCurrentUser api.
const Comments: React.FC<CommentsProps> = ({ comments, projectId }) => {
  const auth = useAuth();

  const [backendComments, setBackendComments] = useState<TComment[]>([]);

  // set the backend comments array when we mount the Components comment
  useEffect(() => {
    // check that comments array is not null
    if (comments != null) {
      setBackendComments(comments);
    } else {
      console.log("We have an empty comment array");
    }
  }, [comments]);

  // Function to handle comment submission
  const addComment = async (text: string) => {
    auth.onlyAuthenticated();
    const token = auth.getToken();
    if (token) {
      const comment = {} as TComment;

      fetch(`${API_URL}/api/projects/comment`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          projectId: projectId,
          commentBody: text,
        }),
      })
        // update the backendComments (need to create a comment object based on response using the interface)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          comment._id = data._id;
          comment.project = data.project;

          comment.commentBody = data.commentBody;
          comment.parentComment = data.parentComment;
          comment.createdAt = data.createdAt;
          comment.updatedAt = data.updatedAt;
          comment.__v = data.__v;

          // comment use field needs to be updated one by one
          comment.user = data.user;

          setBackendComments([comment, ...backendComments]);
        });
    }

    // Yathi - replaced with onlyAuthenticated() to redirect user.
    // } else {
    //   alert("You must be logged in to leave a comment");
    // }
  };

  // set condition for admin being allowed to
  const handleNotAllowed = () => {
    if (auth.isAllowed(["admin"])) {
      alert("allowed");
    } else {
      alert("not allowed");
    }
  };

  // only users who are the author of the comment OR are admin can delete comments.
  // make use of the auth.isAllowed?
  // Yathi - Probably don't need to do another auth check as the delete button only renders for authorised users
  // ...and backend will also do another check.
  const deleteComment = async (commentId: string) => {
    const token = auth.getToken();
    if (token) {
      // Yathi - Need to replace with a mui modal.
      // if (window.confirm("Are you sure you want to remove comment?")) {
      fetch(`${API_URL}/api/projects/comment/${commentId}`, {
        method: "DELETE",
        // Yathi - This endpoint doesn't need a body
        headers: {
          // Accept: "application/json",
          // "Content-Type": "application/json",
          "x-auth-token": token,
        },
        // body: JSON.stringify({
        //   commentId: comment._id,
        // }),
      }).then(() => {
        // we need to update the backend comments list
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment._id != commentId
        );
        setBackendComments(updatedBackendComments);
      });
      // }
    }
  };

  return (
    <div className="comments" style={{ width: "100%", marginLeft: "20px" }}>
      {/* Yathi - Changed variant from body1 to h4 and made component h2 */}
      <Typography
        variant="h4"
        component={"h2"}
        color="black"
        fontWeight={"light"}
        mb={4}
      >
        Discussion ({backendComments.length})
      </Typography>

      <CommentForm submitLabel="Post" handleSubmit={addComment} />

      <div className="comments-container">
        {backendComments.map((backendComment) => (
          <MyComment
            key={backendComment._id}
            comment={backendComment}
            deleteComment={deleteComment}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
