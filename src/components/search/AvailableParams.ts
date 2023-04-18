import getSearchParams from "../../api/getSearchParameters"
import { TProject } from "../../api/getProjects";


export type TAvailParameters = {
  category: { _id: string; value: string; qParam?: string; parameterType: string }[];
  semester: { _id: string; value: string; qParam?: string; parameterType: string }[];
  award: { _id: string; value: string; qParam?: string; parameterType: string }[];
  sortBy: { _id: string; qParam: keyof TProject; value: string; parameterType: string }[];
};

// Returns new object literal of default params each time.
export const getDefaultParams = (): TAvailParameters => {
    return {
      category: [{ _id: '0', value: "All (Default)", parameterType: "category" }],
      semester: [{ _id: '0', value: "All (Default)", parameterType: "semester" }],
      award: [{ _id: '0', value: "All (Default)", parameterType: "award" }],
      sortBy: [
        {_id:'0', qParam: "name", value: "Name (Default)", parameterType: "sortBy"},
        {_id:'1', qParam: "semester", value: "Semester", parameterType: "sortBy"},
        {_id:'2', qParam: "category", value: "Category", parameterType: "sortBy"},
        {_id:'3', qParam: "likes", value: "Likes", parameterType: "sortBy"},
        {_id:'4', qParam: "badges", value: "Awards", parameterType: "sortBy"}
      ]
    }
  }

// main variable that holds the currently available parameters
export let searchFilterParams: TAvailParameters = getDefaultParams();


// Calls api and sets params
export async function fetchCurrentParameters() {
  const [cats, sems, awards, sorts] = await getSearchParams();
  searchFilterParams = {
    category: [...(getDefaultParams().category), ...cats],
    semester: [...(getDefaultParams().semester), ...sems],
    award: [...(getDefaultParams().award), ...awards],
    sortBy: [...(getDefaultParams().sortBy)],
  }
}