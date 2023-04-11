import { API_URL } from "./config";
import { TProject } from "./getProjects";
import { TSearchFilterProps } from "../components/search";


export async function getProjectsSearch({keywords, category, semester, award, sortby}: TSearchFilterProps): Promise<TProject[]> {
  
  let qParam = `keyword=${keywords}`
  if (keywords == '') {
    qParam = '';
  }
  
  const response = await fetch(`${API_URL}/api/projects/search?${qParam}`);
  return response.json();
}
