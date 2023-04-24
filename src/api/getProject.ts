import { TProject } from "../model/TProject";
import {API_URL} from "./config"

export async function getProject(pId: string): Promise<TProject | null> {
    const resp = await fetch(`${API_URL}/api/projects/${pId}`);
    if (resp.ok) {
        return resp.json()
    }
    return null
}
