import { API_URL } from "./config";
import { TProject } from "./getProjects";

export type TAvailParameters = {
  category: { _id: string; value: string; qParam?: string; parameterType: string }[];
  semester: { _id: string; value: string; qParam?: string; parameterType: string }[];
  award: { _id: string; value: string; qParam?: string; parameterType: string }[];
  sortBy: { _id: string; qParam: keyof TProject; value: string; parameterType: string }[];
};

export default async function getSearchParams() {

  const responses = await Promise.all([
    fetch(`${API_URL}/api/parameters/categories`),
    fetch(`${API_URL}/api/parameters/semesters`),
    fetch(`${API_URL}/api/parameters/awards`),
    fetch(`${API_URL}/api/parameters/sortBys`),
  ]);

  return await Promise.all(responses.map((r) => r.json()));

}
