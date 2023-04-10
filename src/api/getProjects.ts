import { API_URL } from "./config";

export type TProject = {
  _id: string;
  name: string;
  semester: {value: string};
  repoLink: string;
  likes: number;
  badges: Object;
  category: Object;
  comments: string[]
  content: Object[]
  members: Object[]
  tags: Object[] // we don't really need this
  teamname: string
};

export async function getProjects(): Promise<TProject[]> {
  const response = await fetch(`${API_URL}/api/projects`);
  return response.json();
}
