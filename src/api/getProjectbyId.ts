import { API_URL } from "./config";
// we just reuse TProject from "getProjects"
import { TProject } from "./getProjects";
import { TProjectState } from "../app";

export async function getProjectbyId(projectId: string) {
  const response = await fetch(`${API_URL}/api/projects/${projectId}`);
  return response.json();
}
