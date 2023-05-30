import { API_URL } from "./config";

export async function deleteParameter(id: string, token: string) {
  const resp = await fetch(`${API_URL}/api/parameters/${id}`, {
    method: "DELETE",
    headers: {
      "x-auth-token": token,
    },
  });
  return resp.json();
}
