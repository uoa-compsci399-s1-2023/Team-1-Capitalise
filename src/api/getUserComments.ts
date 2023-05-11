import { TComment } from "../model/TComment";
const TEMP_API =
  "https://mbw0ut8bmf.execute-api.ap-southeast-2.amazonaws.com/staging";

export async function getUserComments(userId: string): Promise<TComment[]> {
  const response = await fetch(`${TEMP_API}/api/users/myComments/${userId}`);
  if (!response.ok) {
    response.text().then((err) => console.log(err));
    return [];
  }
  return response.json();
}
