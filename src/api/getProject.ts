import { TProject } from "../model/TProject";

export async function getProject(pId: string): Promise<TProject | null> {
    const resp = await fetch(`https://bh71phacjb.execute-api.ap-southeast-2.amazonaws.com/api/projects/${pId}`);
    if (resp.ok) {
        return resp.json()
    }
    return null
}
