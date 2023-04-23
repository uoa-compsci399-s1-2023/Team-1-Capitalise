import { TUser } from "../model/TUser";
import { API_URL } from "./config";

export async function getUser(userId: string): Promise<Promise<TUser> | null> {
  const response = await fetch(`${API_URL}/api/users/user/${userId}`);
  if (response.status === 404 || response.status === 400) {
    response.text().then(err => console.log(err))
    return null;
  }
  return response.json();
}
