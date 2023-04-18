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

interface Comment {
  commentId: string;
  userId: string; // this is the id of the user who wrote the comment. At the time of writing, this would have been set by the currentUser
  commentBody: string;
  parentId?: string;
  createdAt: string;
}

interface CommentsProps {
  comments: Comment[];
  projectId: string;
}

// so instead of passing in currentUserId for authentication, we just pass in the comments array of the current project.
// we handle auth through the useAuth rather than through the getCurrentUser api.
const Comments: React.FC<CommentsProps> = ({ comments, projectId }) => {
  const [backendComments, setBackendComments] = useState(comments);

  // we must first get root comment since some comments may be replies
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId == null
  );
  const getReplies = (commentId: any) => {
    return backendComments
      .filter((backendComment) => backendComment.parentId == commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  // Function to handle comment submission
  const addComment = async (text: string) => {
    console.log("addComment", text);
    await createComment("643cd630b9c2e863834d1be5", text); // use proxy projectId for now.
  };

  return (
    <div className="comments">
      <Typography variant="h6" color="initial" fontWeight={100}>
        Write comment
      </Typography>
      <CommentForm submitLabel="Submit" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <MyComment
            key={rootComment.commentId}
            comment={rootComment}
            replies={getReplies(rootComment.commentId)}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
