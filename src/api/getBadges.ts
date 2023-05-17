// https://mbw0ut8bmf.execute-api.ap-southeast-2.amazonaws.com/staging/api/parameters/awards

import { API_URL } from "./config";

export async function getBadges() {
    const resp = fetch(`${API_URL}/api/parameters/awards`)
    return resp
}