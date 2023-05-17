import { TComment } from "./TComment";
import { TContentTab } from "./TContentTab";

export type TProject = {
  _id: string;
  name: string;
  teamname: string;
  blurb: string;
  views: number;
  semester: { value: string };
  category: {
    value: "Mobile Development" | "Game Development" | "Web Development";
  };
  links: {
    value: string;
    type:
      | "github"
      | "codesandbox"
      | "deployedSite"
      | "codepen"
      | "notion"
      | "kaggle"
      | "linkedin";
    _id: string;
  }[];
  members: string[];
  banner: string;
  thumbnail: string;
  content: TContentTab[]
  likes: number;
  comments: string[]; // array of ids
  tags: { name: string }[];
  // badges: { value: "Peoples Choice" | "Top Excellence" | "Community Impact" }; // There should be an apostrophe in people's choice!
  badges: {
    _id: string
    value: string
  };
  isBeingEdited: false;
  createdAt: string;
  updatedAt: string;
};
