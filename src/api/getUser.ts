import { API_URL } from "./config";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  likedProjects: [];
  myComments: [];
  userType: string;
  project: {
    _id: string;
    name: string;
  };
  profilePicture: string;
};

export async function getUser(userName: string) {
  const response = await fetch(`${API_URL}/api/users/${userName}`);
  return response.json();
}
