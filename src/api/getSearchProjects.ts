import { API_URL } from "./config";
import { TProject } from "./getProjects";
import { TSearchFilterProps } from "../components/SearchFilters";


export async function getProjectsSearch(keywords: string): Promise<TProject[]> {

  keywords = (keywords === "") ? "-1" : keywords

  const response = await fetch(`${API_URL}/api/projects/search/${keywords}/-1/-1/-1/-1`);
  return response.json();
}
