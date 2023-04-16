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

const mockUser1: TUser = {
  _id: '2',
  name: 'Troy Barnes',
  username: 'tb',
  password: 'test',
  email: '',
  likedProjects: [],
  isGoogleCreated: true,
  myComments: [],
  userType: 'graduate',
  project: {_id: '1', name: 'InceptionNet' },
  profilePicture: 'src/components/projectPage/dps/Troy_Season_Two1.webp'

}

const mockUser2: TUser = {
  _id: '2',
  name: 'Annie Edison',
  username: 'tb',
  password: 'test',
  email: '',
  likedProjects: [],
  isGoogleCreated: true,
  myComments: [],
  userType: 'graduate',
  project: {_id: '1', name: 'InceptionNet' },
  profilePicture: 'src/components/projectPage/dps/annie1280jpg-e9764d_160w.jpg'
}

const mockUser3: TUser = {
  _id: '3',
  name: 'Pierce Hawthorne',
  username: 'tb',
  password: 'test',
  email: '',
  likedProjects: [],
  isGoogleCreated: true,
  myComments: [],
  userType: 'graduate',
  project: {_id: '1', name: 'InceptionNet' },
  profilePicture: 'src/components/projectPage/dps/pierce_400x400.jpg'

}

const mockUser4: TUser = {
  _id: '4',
  name: 'Chang',
  username: 'tb',
  password: 'test',
  email: '',
  likedProjects: [],
  isGoogleCreated: true,
  myComments: [],
  userType: 'graduate',
  project: {_id: '1', name: 'InceptionNet' },
  profilePicture: 'src/components/projectPage/dps/chang.webp'
}




export const mockProject: TMockProject = {
  _id: "1",
  name: "InceptionNet",
  blurb: "Building a neural network from scratch.",
  semester: { value: "S1 2023" },
  category: { value: "Web Development" },
  links: [{
    type: 'github',
    value: "https://github.com/uoa-compsci399-s1-2023/project-team-1"}],
  teamname: "Zuckerberg Enterprises",
  members: [mockUser1, ],
  likes: 17,
  views: 52,
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
        // { 
        //   type: "gallery", value: ["src/components/projectPage/galleryImgs/img1.png",] 
        // },
        // {
        //   type: "quote",
        //   value: ["We built a neural network from scratch.",]
        // },
        {
          type: "text",
          subHeading: "Description",
          value: [`Deep Learning has become a popular topic in recent times. It involves emulating the neural structure of the human brain through a network of nodes called a Neural Network. While our brain's neurons have physical components like nucleus, dendrites, and synapses, Neural Network neurons are interconnected and have weights and biases assigned to them. A neural network typically consists of an input layer, an output layer, and one or more hidden layers. In conventional neural networks, all nodes in these layers are interconnected to form a dense network. However, there are cases where certain nodes in the network are not connected to others, which are referred to as Sparse Neural Networks. InceptionNet models for image classification use Sparse Neural Networks. The following figure illustrates the structure of a neural network.`,]
        },
      ],
    }
  ],
  badges: [{
    id: '1',
    value: 'People\'s Choice',
    runnerUp: false,
    image: 'src/assets/peoplesChoice.svg'
  }],
  comments: [],
  tags: []
}