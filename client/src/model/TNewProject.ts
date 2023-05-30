import { TProject } from "./TProject";

// Backend accepts a different project object when POST/PATCH compared to GET

export type TNewProject = {
  name: string; // Max 100 characters
  teamname?: string;
  banner?: string;
  thumbnail?: string;
  semester: string;
  category: string;
  links?: TProject['links']      // links are a list of JSON objects with a "value" and "type"
  content: {
    tabName: string;
    tabContent: {
      type: string;
      subHeading: string;
      value: string[];
    }[];
  }[];
  tags: {name: string}[];
};
