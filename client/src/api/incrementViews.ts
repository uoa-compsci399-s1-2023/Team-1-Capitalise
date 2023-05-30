// https://bh71phacjb.execute-api.ap-s outheast-2.amazonaws.com/api/pro jects/:projectId/incrementViews
import { API_URL } from "./config"

export async function incrementViews(pId: string) {
    const resp = fetch(`${API_URL}/api/projects/${pId}/incrementViews`, {
        method: 'PATCH'
    })
    return resp
}
