import { TNewProject } from "../model/TNewProject";
import { API_URL } from "./config";

export async function createProject(newProject: TNewProject, token: string) {
  const response = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "x-auth-token": token,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: newProject.name,
      teamname: newProject.teamname,
      semester: newProject.semester,
      category: newProject.category,
      //banner: newProject.banner,
      //thumbnail: newProject.thumbnail,
      content: newProject.content,
    }),
  });
  return response.json();
}

// might need to return JSON object of the created project so we can access the projectId field needed for S3 endpoints.
