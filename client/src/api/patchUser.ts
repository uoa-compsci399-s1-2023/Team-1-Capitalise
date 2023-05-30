import { API_URL } from "./config";

export async function patchUser(userID: string, body: {}, token: string) {
  const resp = fetch(`${API_URL}/api/users/user/${userID}`, {
    method: "PATCH",
    headers: {
      "x-auth-token": token,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return resp;
}
