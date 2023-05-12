import { TComment } from "../model/TComment";
import { API_URL } from "./config";

export async function getUserComments(userId: string): Promise<TComment[]> {
  const response = await fetch(`${API_URL}/api/users/myComments/${userId}`);
  if (!response.ok) {
    response.text().then((err) => console.log(err));
    return [];
  }
  return response.json();
}
