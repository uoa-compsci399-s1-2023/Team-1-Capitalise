import { API_URL } from "./config";

export async function adminDeleteProject(projectId: string, token: string) {
  const resp = fetch(`${API_URL}/api/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
    },
  })
  return resp
  }