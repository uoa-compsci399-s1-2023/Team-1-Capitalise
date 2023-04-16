import { TMockProject } from "./MockProject";

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

export const mockUser: TUser = {
    _id: "1",
    name: "Snoop Dogg",
    email: "dogg@gmail.com",
    username: "dogg696",
    // password: "$2a$10$xk2SY1gbcKLlO.o5vYEEUOxSsieiqOf5qrZ2Dan3UBy13KMz0sdse", // "decodes to test"
    likedProjects: ["1"], // references mockProject
    myComments: [],
    userType: 'graduate',
    project: ["6432f9226cce2fc1706572e3",],
    isGoogleCreated: false,
    profilePicture: '' 
}

// {
//     "_id": "6432f8a46cce2fc1706572db",
//     "name": "Yathi Kidambi",
//     "email": "ykid285@aucklanduni.ac.nz",
//     "username": "ykid285",
//     "likedProjects": [],
//     "myComments": [],
//     "userType": "graduate",
//     "__v": 0,
//     "project": "6432f9226cce2fc1706572e3",
//     "isGoogleCreated": false
// }