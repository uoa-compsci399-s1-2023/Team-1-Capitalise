import { TProject } from "../model/TProject";
import {API_URL} from "./config"

export async function createProject(newProject: TProject, token: string) {
    const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
        Accept: "application/json",
                "Content-Type": "application/json",
                "x-auth-token": token,
    },
    body: JSON.stringify({
      name: newProject.name,
      teamname: newProject.teamname,
      blurb: newProject.blurb,
      semester: newProject.semester,
      category: newProject.category,
      links: newProject.links,
      banner: newProject.banner,
      thumbnail: newProject.thumbnail,
      content: newProject.content,
      tags: newProject.tags
    }),
  })
  .then((response) => {
    return response.json();
  })
}


