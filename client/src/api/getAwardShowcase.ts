import { TProject } from "../model/TProject";
import { API_URL } from "./config";

export async function getAwardShowcase(): Promise<TProject[] | undefined> {
  const response = await fetch(`${API_URL}/api/projects/awardedProjects`);
  if (response.ok) {
    return response.json();
  } else {
    response.text().then((err) => console.log(err));
    return;
  }
}
