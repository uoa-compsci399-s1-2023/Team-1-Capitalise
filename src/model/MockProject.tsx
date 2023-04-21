import { TProject } from '../model/TProject'
import { TUser, mockUser } from './TUser';

export type TProjectPost = {
  name: string;
  blurb?: string;
  teamname?: string;
  banner?: string;
  thumbnail?: string;
  semester: string
  category: TProject['category']['value']
  links?: {
    type: 'github' | 'codesandbox' | 'deployedSite' | 'codepen' | 'notion' | 'kaggle'
    value: string
  }[];
  content?:
  {
    tabName: string
    tabContent:
    {
      type: "gallery" | "poster" | "text" | "video" | "codeBlock" | "quote" | "image"
      subHeading?: string
      value: string[]
    }[],
  }[]
  badges?: TProject['badges'][0]['value']
  tags?: string[]
};

export type TMockProject = {
  _id: string;
  name: string;
  teamname: string;
  timestamp?: number; // Added when backend recieves project.
  blurb?: string;
  views: number;
  semester: {
    value: string;
  };
  category: {
    value: string;
  };
  links?: {
    _id: string
    type: 'github' | 'codesandbox' | 'deployedSite' | 'codepen' | 'notion' | 'kaggle'
    value: string
  }[];
  members: {
    _id: string;
    name: string;
  }[]
  banner?: string;
  thumbnail: string;
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
  likes: number;


  badges: {
    id: string
    value: 'People\'s Choice' | 'Top Excellence' | 'Community Impact'
    runnerUp: boolean
    image: string;
  }[];
  tags: {
    name: string;
  }[];
  comments: string[] // array of ids
};

const mockUser1: TUser = {
  _id: '2',
  name: 'Troy Barnes',
  username: 'tb',
  email: '',
  likedProjects: [],
  isGoogleCreated: true,
  myComments: [],
  userType: 'graduate',
  project: ['1'],
  profilePicture: 'src/components/projectPage/dps/Troy_Season_Two1.webp'

}

const mockUser2: TUser = {
  _id: '2',
  name: 'Annie Edison',
  username: 'tb',
  email: '',
  likedProjects: [],
  isGoogleCreated: true,
  myComments: [],
  userType: 'graduate',
  project: ['1'],
  profilePicture: 'src/components/projectPage/dps/annie1280jpg-e9764d_160w.jpg'
}

const mockUser3: TUser = {
  _id: '3',
  name: 'Pierce Hawthorne',
  username: 'tb',
  email: '',
  likedProjects: [],
  isGoogleCreated: true,
  myComments: [],
  userType: 'graduate',
  project: ['1'],
  profilePicture: 'src/components/projectPage/dps/pierce_400x400.jpg'

}

const mockUser4: TUser = {
  _id: '4',
  name: 'Chang',
  username: 'tb',
  email: '',
  likedProjects: [],
  isGoogleCreated: true,
  myComments: [],
  userType: 'graduate',
  project: ['1'],
  profilePicture: 'src/components/projectPage/dps/chang.webp'
}


export const mockProject: TProjectPost = {
  name: "InceptionNet",
  blurb: "Building a neural network from scratch.",
  semester: "S1 2023",
  category: "Web Development",
  links: [{
    type: 'github',
    value: "https://github.com/uoa-compsci399-s1-2023/project-team-1"
  }],
  teamname: "Zuckerberg Enterprises",
  banner: "src/components/projectPage/galleryImgs/Neural_Networks.png",
  content: [
    {
      tabName: "Overview",
      tabContent: [
        {
          type: "gallery", value: ["src/components/projectPage/galleryImgs/img1.png",]
        },
        {
          type: "text",
          subHeading: "Description",
          value: [`Deep Learning has become a popular topic in recent times. It involves emulating the neural structure of the human brain through a network of nodes called a Neural Network. While our brain's neurons have physical components like nucleus, dendrites, and synapses, Neural Network neurons are interconnected and have weights and biases assigned to them. A neural network typically consists of an input layer, an output layer, and one or more hidden layers. In conventional neural networks, all nodes in these layers are interconnected to form a dense network. However, there are cases where certain nodes in the network are not connected to others, which are referred to as Sparse Neural Networks. InceptionNet models for image classification use Sparse Neural Networks. The following figure illustrates the structure of a neural network.`,]
        },
      ],
    },
    {
      tabName: "Breakdown",
      tabContent: [
        {
          type: "text",
          subHeading: "Description",
          value: [`Deep Learning has become a popular topic in recent times. It involves emulating the neural structure of the human brain through a network of nodes called a Neural Network. While our brain's neurons have physical components like nucleus, dendrites, and synapses, Neural Network neurons are interconnected and have weights and biases assigned to them. A neural network typically consists of an input layer, an output layer, and one or more hidden layers. In conventional neural networks, all nodes in these layers are interconnected to form a dense network. However, there are cases where certain nodes in the network are not connected to others, which are referred to as Sparse Neural Networks. InceptionNet models for image classification use Sparse Neural Networks. The following figure illustrates the structure of a neural network.`,]
        },
      ],
    }
  ],
  badges: 'Peoples Choice'
}