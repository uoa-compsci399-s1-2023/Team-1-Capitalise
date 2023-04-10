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
          photoGallery: [];
          text: string;
          photo: string;
        }
      ];
    }
  ];
  badges: {
    value: "clientWinner" | "clientRunner" | "peopleWinner" | "peopleRunner";
  };
};

export async function getProjects(): Promise<TProject[]> {
  const response = await fetch(`${API_URL}/api/projects`);
  return response.json();
}
