// need to add comment support

import { API_URL } from "./config";

// included the comments: [] parameter
// since we need to retrieve the comments of a given project.
export type TProject = {
  _id: string;
  name: string;
  semester: {
    value: string;
  };
  category: {
    value: string;
  };
  repoLink: string;
  teamname: string;
  likes: number;
  content: [
    {
      tab: [
        {
          banner: string;
          gallery: [];
          poster: string;
          text: string;
          video: string;
        }
      ];
    }
  ];
  badges: {
    value: "CommunityImpact" | "TopExcellence" | "PeoplesChoice";
  };
  comments: [];
};

export async function getProjects(): Promise<TProject[]> {
  const response = await fetch(`${API_URL}/api/projects`);
  return response.json();
}
