export type TUser = {
  _id: string;
  name: string;
  email: string;
  bio: string;
  username: string;
  password: string;
  likedProjects: string[];
  myComments: string[];
  userType: "graduate" | "visitor" | "admin";
  project: { _id: string; name: string };
  isGoogleCreated: boolean;
  profilePicture: string;
  links: {
    _id: string;
    value: string;
    // Need to change to user social links
    type: "github" | "codesandbox" | "deployedSite";
    // | "codepen"
    // | "notion"
    // | "kaggle";
  }[];
};
