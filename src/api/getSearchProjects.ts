import { API_URL } from "./config";
import { TProject } from "./getProjects";
import { TSearchFilterProps } from "../components/SearchFilters";


export async function getProjectsSearch({keywords}: TSearchFilterProps): Promise<TProject[]> {
  
  if (keywords == '') {
    keywords = '-1';
  }
  
  const response = await fetch(`${API_URL}/api/projects/search/${keywords}/-1/-1/-1/-1`);
  return response.json();
}
