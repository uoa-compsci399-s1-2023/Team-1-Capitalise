import { TUser } from "../model/TUser";
import { API_URL } from "./config";

export async function getUser(userId: string): Promise<Promise<TUser> | undefined> {
  const response = await fetch(`${API_URL}/api/users/user/${userId}`);
  if (!response.ok) {
    response.text().then(err => console.log(err))
    return;
  }
  return response.json();
}
