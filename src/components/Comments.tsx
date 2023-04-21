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
import { getUserbyId, TUser } from "../api/getUserbyId";
import { useParams } from "react-router-dom";

interface CommentsProps {
  comments: TComment[];
  projectId?: string;
}

// so instead of passing in currentUserId for authentication, we just pass in the comments array of the current project.
// we handle auth through the useAuth rather than through the getCurrentUser api.
const Comments: React.FC<CommentsProps> = ({ comments, projectId }) => {
  const auth = useAuth();

  const [backendComments, setBackendComments] = useState<TComment[]>([]);
  // console.log("backend comments", backendComments);

  // set the backend comments array when we mount the Components comment
  useEffect(() => {
    // check that comments array is not null
    if (comments != null) {
      setBackendComments(comments);
    } else {
      console.log("We have an empty comment array");
    }
  }, comments);

  // Function to handle comment submission
  const addComment = async (text: string) => {
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
          console.log("Posted comment name", data.user);

          comment._id = data._id;
          comment.projectId = data.project;

          comment.commentBody = data.commentBody;
          comment.parentComment = data.parentComment;
          comment.createdAt = data.createdAt;
          comment.updatedAt = data.updatedAt;
          comment.__v = data.__v;

          // comment use field needs to be updated one by one
          comment.user = data.user;

          setBackendComments([comment, ...backendComments]);
        });
    } else {
      alert("You must be logged in to leave a comment");
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
