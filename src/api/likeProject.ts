// api/projects/:projectId/like
import { API_URL } from "./config";

export async function likeProject(pId: string, token: string) {
  const resp = fetch(`${API_URL}/api/projects/${pId}/like`, {
    method: 'PATCH',
    headers: {
      'x-auth-token': token,
    },
  })
  return resp
  }
