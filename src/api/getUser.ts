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
  bio: string;
};

export async function getUser(userID: string): Promise<TUser | undefined> {
  const response = await fetch(`${API_URL}/api/users/user/${userID}`);
  if (response.ok) {
    return response.json();
  }
  return;
}
