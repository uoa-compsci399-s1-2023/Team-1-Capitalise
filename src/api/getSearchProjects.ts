import { API_URL } from "./config";
import { TProject } from "./getProjects";
import { TFiltersState } from "../app";

interface SearchProjectsResponse {
  projects: TProject[];
  searchTotal: number;
}

export async function getProjectsSearch({
  keywords,
  category,
  semester,
  award,
  sortBy,
  currPage,
  projectsPerPage,
}: TFiltersState): Promise<SearchProjectsResponse> {
  let output = {
    searchTotal: 0,
    projects: [],
  };

  try {
    let keywordQParam = `keyword=${keywords}&`;
    if (keywords == "") keywordQParam = "";

    let catQParam = `category=${category.value}&`;
    if (category._id == "0") catQParam = "";

    let semQParam = `semester=${semester.value}&`;
    if (semester._id == "0") semQParam = "";

    let awardQParam = `award=${award.value}&`;
    if (award._id == "0") awardQParam = "";

    let sortQParam = `sortBy=${sortBy.qParam}&`;

    const startIndex = (currPage - 1) * projectsPerPage;
    let pagesQParam = `startIndex=${startIndex}&numProjects=${projectsPerPage}`;

    const response = await fetch(
      `${API_URL}/api/projects/search?${keywordQParam}${catQParam}${semQParam}${awardQParam}${sortQParam}${pagesQParam}`
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
