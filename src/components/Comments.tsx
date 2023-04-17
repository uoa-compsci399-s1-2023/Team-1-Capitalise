// similar to how we had dedicated Projects component for project display
import { useState, useEffect } from "react";
import MyComment from "../components/MyComment";
import CommentForm from "../components/CommentForm";

// import createComment() from api (need to handle POST API request there)

interface Comment {
  commentId: string;
  userId: string; // this is the id of the user who wrote the comment. At the time of writing, this would have been set by the currentUser
  commentBody: string;
  parentId?: string;
  createdAt: string;
}

interface CommentsProps {
  currentUserId: string;
  comments: Comment[];
}

const Comments: React.FC<CommentsProps> = ({ currentUserId, comments }) => {
  // console.log("All project comments:", comments);

  // we must first get root comment since some comments may be replies
  const rootComments = comments.filter((comment) => comment.parentId == null);
  // console.log("Only root comments:", rootComments);

  const getReplies = (commentId: any) => {
    return comments
      .filter((comment) => comment.parentId == commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  const addComment = (text, parentId) => {
    console.log("addComment", text, parentId);
    // we need to pass in our post comment API
  };

  return (
    <div className="comments">
      <div className="comment-form-title">Write comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <MyComment
            key={rootComment.commentId}
            comment={rootComment}
            replies={getReplies(rootComment.commentId)}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
