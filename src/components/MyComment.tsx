// this is just for a single comment

import { Container, Box, Typography } from "@mui/material";

import { getUserbyId, TUser } from "../api/getUserbyId";

import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";

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
  currentUserId: string;
}

const MyComment: React.FC<CommentProps> = ({
  comment,
  replies,
  currentUserId,
}) => {
  // const fiveMinutes = 300000;
  // const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes;
  const canReply = Boolean(currentUserId); // if currentUser is null then they cannot reply, if we have a current user id it means user is authenticated and can reply
  const canEdit = currentUserId == comment.userId; // check if the current user is the one that wrote the comment.
  const canDelete = currentUserId == comment.userId;

  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  // we set the user associated with the comment we want to display
  const [user, setUser] = useState<TUser | undefined>();
  let { userId } = useParams();

  // grab the user associated with the comment (do know if i need the useEffect??)
  useEffect(() => {
    const fetchUsername = async () => {
      // hard coded atm, but will link to real users later.
      // did this since mock user won't work with fetch API
      const newUser = await getUserbyId("6432f85f6cce2fc1706572cf");
      setUser(newUser);

      // check the user
      console.log(newUser.username);
    };
    fetchUsername();
  }, [userId]);

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
          <div>{createdAt}</div>
        </div>
        <div className="comment-text">{comment.commentBody}</div>
        <div className="comment-actions">
          {canReply && <div className="comment-action">Reply</div>}
          {canEdit && <div className="comment-action">Edit</div>}
          {canDelete && <div className="comment-action">Delete</div>}
        </div>
        {replies.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <MyComment
                comment={reply}
                key={reply.commentId}
                replies={[]}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComment;
