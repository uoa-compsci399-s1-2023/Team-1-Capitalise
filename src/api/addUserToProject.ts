// https://bh71phacjb.execute-api.ap-s outheast-2.amazonaws.com/api/pro jects/addUser/:projectId/:userId

import { API_URL } from "./config";

export async function addUserToProject(pId: string, userId: string) {
    const resp = fetch(`${API_URL}/projects/addUser/${pId}/${userId}`, {
    method: 'PATCH',
  })
  return resp
}
