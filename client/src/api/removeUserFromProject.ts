// https://bh71phacjb.execute-api.ap-s outheast-2.amazonaws.com/api/pro jects/removeUser/:projectId/:userId

import { API_URL } from "./config";

export async function removeUserFromProject(pId: string, userId: string, token: string) {
    const resp = fetch(`${API_URL}/api/projects/removeUser/${pId}/${userId}`, {
    method: 'PATCH',
    headers: {
      'x-auth-token': token
    }
  })
  return resp
}
