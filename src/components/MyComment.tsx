// this is just for a single comment

import { Container, Box, Typography } from "@mui/material";

interface Comment {
  commentId: string;
  userId: string;
  commentBody: string;
  parentId?: string;
  createdAt: Date;
}

interface CommentProps {
  comment: Comment;
  replies: Comment[];
}

const MyComment: React.FC<CommentProps> = ({ comment, replies }) => {
  return (
    <div className="comment">
      <div className="comment-image-container">
        <img
          src="src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg"
          width="30"
          height="30"
        />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">{comment.userId}</div>
        </div>
        <div className="comment-text">{comment.commentBody}</div>
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
