import { TProject } from "../model/TProject";
import { API_URL } from "./config";

export async function getAwardShowcase(): Promise<TProject[]> {
  const response = await fetch(`${API_URL}/api/projects/awardedProjects`);
  return response.json();
}
