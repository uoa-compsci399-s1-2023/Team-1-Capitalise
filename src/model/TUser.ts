import { TMockProject } from "./MockProject";

export type TUser = {
    _id: string;
    name: string;
    email: string;
    username: string;
    likedProjects: string[]
    myComments: string[]
    userType: "graduate" | "visitor" | "admin";
    project: {_id: string; name: string;}
    isGoogleCreated: boolean
    profilePicture: string
}

// export const mockUser: TUser = {
//     _id: "1",
//     name: "Snoop Dogg",
//     email: "dogg@gmail.com",
//     username: "dogg696",
//     likedProjects: ["1"], // references mockProject
//     myComments: [],
//     userType: 'graduate',
//     project: ["6432f9226cce2fc1706572e3",],
//     isGoogleCreated: false,
//     profilePicture: '' 
// }
