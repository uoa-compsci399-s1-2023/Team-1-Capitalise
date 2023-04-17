import { TMockProject } from "./TMockProject";

export type TUser = {
    _id: string;
    name: string;
    email: string;
    username: string;
    // password: string; // not in getCurrentUser api
    likedProjects: string[]
    myComments: string[]
    userType: "graduate" | "visitor" | "admin";
    project: string[]
    isGoogleCreated: boolean
    profilePicture?: string
}