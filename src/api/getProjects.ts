// need to add comment support

import { API_URL } from "./config";

// included the comments: [] parameter
// since we need to retrieve the comments of a given project.
export type TProject = {
  _id: string;
  timestamp?: number;
  name: string;
  blurb?: string; // Added field. Short description of project
  semester: {
    value: string;
  };
  category: {
    value: string;
  };
  links?: {
    value: string;
    type:
      | "github"
      | "codesandbox"
      | "deployedSite"
      | "codepen"
      | "notion"
      | "kaggle";
  }[];
  teamname: string;
  likes: number;
  views: number; // Added field. Stores how many times the project has been viewed.
  banner: string; // Only one banner per project
  thumbnail: string;
  content: // Array of tabs
  {
    tabName: string; // Added field
    tabContent: // Changed from "tab"
    {
      type: "gallery" | "poster" | "text" | "video" | "codeBlock" | "quote";
      subHeading?: string;
      value: string[]; // Only gallery types contain multiple fields.
    }[];
  }[];
  badges: {
    id: number;
    value: "Peoples Choice";
    runnerUp: boolean;
    image: string;
  };
  tags: {
    id: number;
    name: string;
    mentions: number;
    projects: TProject[];
  };
  comments: [];
};

export async function getProjects(): Promise<TProject[]> {
  const response = await fetch(`${API_URL}/api/projects`);
  return response.json();
}
