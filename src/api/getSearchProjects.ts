import { API_URL } from "./config";
import { TProject } from "./getProjects";
import { TFiltersState } from "../routes/Projects";


export async function getProjectsSearch({
  keywords, category, 
  semester, award, sortBy,
  currPage, projectsPerPage
}: TFiltersState): Promise<TProject[]> {
  
  let keywordQParam = `keyword=${keywords}&`
  if (keywords == '')
    keywordQParam = '';

  let catQParam = `category=${category.value}&`
  if (category._id == '0')
    catQParam = '';

  let semQParam = `semester=${semester.value}&`
  if (semester._id == '0')
    semQParam = '';

  let awardQParam = `award=${award.value}&`
  if (award._id == '0')
    awardQParam = '';

  let sortQParam = `sortBy=${sortBy.qParam}&`
  
  const startIndex = (currPage - 1) * projectsPerPage;
  let pagesQParam = `startIndex=${startIndex}&numProjects=${projectsPerPage}`
  
  const response = await fetch(`${API_URL}/api/projects/search?${keywordQParam}${catQParam}${semQParam}${awardQParam}${sortQParam}${pagesQParam}`);
  return response.json();
}
