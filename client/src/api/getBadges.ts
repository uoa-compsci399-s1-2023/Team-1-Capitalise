// https://mbw0ut8bmf.execute-api.ap-southeast-2.amazonaws.com/staging/api/parameters/awards
import { TParameter } from "../model/TParameter";

import { API_URL } from "./config";

export async function getBadges() {
    const resp = fetch(`${API_URL}/api/parameters/awards`)
    return resp
}

export async function getBadgeById(bId: string) {
    const resp = await getBadges();
    if (resp.ok) {
        const badges: TParameter[] = await resp.json();
        const badge = badges.filter(b => b._id === bId);
        if (badge.length > 0) {
            return badge[0];
        } else {
            console.log(`Badge id ${bId} not found.`)
        }
    } else {
        console.log(await resp.text());
    }
}