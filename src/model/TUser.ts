export type TUser = {
    _id: string;
    name: string;
    email: string;
    bio: string;
    username: string;
    likedProjects: string[]
    myComments: string[]
    userType: "graduate" | "visitor" | "admin";
    project: {_id: string; name: string;}
    isGoogleCreated: boolean
    profilePicture: string
}