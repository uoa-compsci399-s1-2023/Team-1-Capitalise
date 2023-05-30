import { API_URL } from "./config";

export async function deleteComment(commentId: string, token: string) {
  const resp = fetch(`${API_URL}/api/projects/comment/${commentId}`, {
    method: "DELETE",
    headers: {
      "x-auth-token": token,
      "content-type": "application/json",
    },
  });
  return resp;
}
