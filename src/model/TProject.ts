import { TComment } from "./TComment";
import { TContentTab } from "./TContentTab";
import { TTag } from "./TTag";

export type TProject = {
  _id: string;
  name: string;
  teamname: string;
  blurb: string;
  views: number;
  semester: { value: string };
  category: {
    value: string;
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
  members: string[]; // Array of ids!
  banner: string;
  thumbnail: string;
  content: TContentTab[]
  likes: number;
  comments: string[]; // array of ids
  tags: TTag[]
  badges: {
    _id: string
    value: string
  };
  isBeingEdited: false;
  createdAt: string;
  updatedAt: string;
};
