import { TProject } from "../model/TProject";
import { API_URL } from "./config";

export async function getProjectsCategory(
  category: string
): Promise<TProject[] | undefined> {
  const resp = await fetch(
    `${API_URL}/api/projects/search?category=${category}`
  );
  if (resp.ok) {
    return resp.json();
  } else {
    resp.text().then((err) => console.log(err));
    return;
  }
}
