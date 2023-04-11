import { API_URL } from "./config";
import { TProject } from "./getProjects";
import { TSearchFilterProps } from "../components/search";


export async function getProjectsSearch({keywords, category, semester, award, sortby}: TSearchFilterProps): Promise<TProject[]> {
  
  if (keywords == '') {
    keywords = '-1';
  }
  
  const response = await fetch(`${API_URL}/api/projects/search/${keywords}/-1/-1/-1`);
  // console.log(response.json());
  return response.json();
}
