export type TComment = {
    _id: string;
    projectId: string;
    commentBody: string;
    parentComment?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    user: {
      email: string;
      name: string;
      profilePicture: string;
      username?: string;
      _id: string;
    };
  };