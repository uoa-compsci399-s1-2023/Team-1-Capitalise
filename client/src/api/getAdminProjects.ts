import { API_URL } from "./config";
import { TProject } from "../model/TProject";
import { TFiltersState } from "../app";

interface SearchProjectsResponse {
  projects: TProject[];
  searchTotal: number;
}

export async function getAdminProjects(
  sortBy: string,
  numOfProjects: number
): Promise<SearchProjectsResponse> {
  let output = {
    searchTotal: 0,
    projects: [],
  };

  try {
    let sortByQParam = `sortBy=${sortBy}&`;
    let projectsQParam = `numProjects=${numOfProjects}`;

    const response = await fetch(
      `${API_URL}/api/projects/search?${sortByQParam}${projectsQParam}`
    );

    output = await response.json().then((jsonData) => {
      return {
        searchTotal: jsonData[0],
        projects: jsonData.slice(1),
      };
    });
  } catch (error) {
    console.log(`FAILED TO FETCH PROJECTS\n${error}`);
  } finally {
    return output; // If fetch failed an empty project list + totalSearch of 0 is returned.
  }
}
