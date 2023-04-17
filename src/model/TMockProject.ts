import { TProject } from '../api/getProjects'
import { TUser, mockUser } from './TUser';

export type TMockProject = {
    _id: string;
    timestamp?: number; // Added when backend recieves project.
    name: string;
    blurb?: string;
    semester: {
      value: string;
    };
    category: {
      value: string;
    };
    links?: {
      type: 'github' | 'codesandbox' | 'deployedSite' | 'codepen' | 'notion' | 'kaggle'
      value: string
    }[];
    teamname: string;
    likes: number;
    views: number;
    banner?: string;
    // thumbnail: string;

    members: {
      _id: string;
      name: string;
    }[]

    content:
    {
      tabName: string
      tabContent:
      {
        type: "gallery" | "poster" | "text" | "video" | "codeBlock" | "quote" | "image"
        subHeading?: string
        value: string[]  // Perhaps look into whether it can be a string[] + string?
      }[],
    }[]


    badges: {
      id: string
      value: 'People\'s Choice' | 'Top Excellence' | 'Community Impact'
      runnerUp: boolean
      image: string;
    }[];
    tags: {
      id: string;
      name: string;
      mentions: number;
      projects: TProject[];
    }[];
    comments : {
      id: string
      projectId: number
      userId: number
      commentBody: string
      parentComment?: number
      createdAt: number
    }[]
  };