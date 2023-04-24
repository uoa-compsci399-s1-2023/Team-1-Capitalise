import { API_URL } from "./config";

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
};

export async function getProjects(): Promise<TProject[] | null> {
  const response = await fetch(`${API_URL}/api/projects`);
  if (response.status == 404) {
    return null
  }
  return response.json();
}
