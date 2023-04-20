// similar to how we had dedicated Projects component for project display
import { useState, useEffect } from "react";
import { Container, Box, Typography } from "@mui/material";
import MyComment from "../components/MyComment";
import CommentForm from "../components/CommentForm";

// import createComment() from api (need to handle POST API request there)
import { createComment } from "../api/createComment";

import { useAuth } from "../customHooks/useAuth";
import { getCurrentUser } from "../api/getCurrentUser";
import { create } from "@mui/material/styles/createTransitions";

import { API_URL } from "../api/config";

import { TComment } from "../api/getComments";

interface CommentsProps {
  comments: TComment[];
  projectId?: string;
}

interface CommentDisplay {
  commentBody: string;
  user: string;
  date: string;
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
      console.log("We have comments");
      setBackendComments(comments);
    } else {
      console.log("We have an empty comment array");
    }
  }, comments);

  // Function to handle comment submission
  const addComment = async (text: string) => {
    console.log("addComment", text, projectId);

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
          comment.id = data._id;
          comment.projectId = data.project;
          comment.userId = data.user; // problem here is that data.user is a User object - not a string.
          comment.commentBody = data.commentBody;
          comment.parentComment = data.parentComment;
          comment.createdAt = data.createdAt;
          comment.updatedAt = data.updatedAt;
          comment.__v = data.__v;

          setBackendComments([comment, ...backendComments]);
        });
    } else {
      alert("You must be logged in to leave a comment");
    }
  };

  // might bring in deleteComment method defined in MyComment component.
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

  return (
    <div className="comments">
      <Typography variant="body1" color="initial" fontWeight={"light"}>
        Project Discussion ({backendComments.length})
      </Typography>
      <CommentForm submitLabel="Post" handleSubmit={addComment} />
      <div className="comments-container">
        {backendComments.map((backendComment) => (
          <MyComment key={backendComment.id} comment={backendComment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
