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

export async function getUser(userName: string): Promise<TUser | undefined> {
  const response = await fetch(`${API_URL}/api/users/${userName}`);
  if (response.ok) {
    return response.json();
  }
  return;
}
