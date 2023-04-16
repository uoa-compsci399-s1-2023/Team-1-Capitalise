// similar to how we had dedicated Projects component for project display
import { useState, useEffect } from "react";
import MyComment from "../components/MyComment";

interface Comment {
  commentId: string;
  userId: string;
  commentBody: string;
  parentId?: string;
  createdAt: Date;
}

interface CommentsProps {
  currentUserId: string;
  comments: Comment[];
}

const Comments: React.FC<CommentsProps> = ({ currentUserId, comments }) => {
  console.log("All project comments:", comments);

  // we must first get root comment since some comments may be replies
  const rootComments = comments.filter((comment) => comment.parentId == null);
  console.log("Only root comments:", rootComments);

  const getReplies = (commentId: any) => {
    return comments.filter((comment) => comment.parentId == commentId);
  };

  return (
    <div className="comments">
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
