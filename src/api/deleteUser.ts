import { API_URL } from "./config";

export async function deleteUser(userID: string, token: string) {
  const resp = fetch(`${API_URL}/api/users/user/${userID}`, {
    method: "DELETE",
    headers: {
      "x-auth-token": token,
      "content-type": "application/json",
    },
  });
  return resp;
}
