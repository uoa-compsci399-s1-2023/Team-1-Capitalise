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

export async function getProject(projectID: string): Promise<TProject> {
  const response = await fetch(`${API_URL}/api/projects/${projectID}`);
  return response.json();
}
