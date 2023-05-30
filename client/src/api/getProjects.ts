import { TProject } from "../model/TProject";
import { API_URL } from "./config";

export async function getProjects(): Promise<TProject[] | null> {
  const response = await fetch(`${API_URL}/api/projects`);
  if (response.status == 404) {
    return null;
  }
  return response.json();
}
