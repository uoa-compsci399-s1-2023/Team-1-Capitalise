import { TProject } from "../api/getProjects";

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
    type:
      | "github"
      | "codesandbox"
      | "deployedSite"
      | "codepen"
      | "notion"
      | "kaggle";
    value: string;
  }[];
  teamname: string;
  likes: number;
  views: number;
  banner?: string;
  // thumbnail: string;

  members: {
    _id: string;
    name: string;
  }[];

  content: {
    tabName: string;
    tabContent: {
      type:
        | "gallery"
        | "poster"
        | "text"
        | "video"
        | "codeBlock"
        | "quote"
        | "image";
      subHeading?: string;
      value: string[]; // Perhaps look into whether it can be a string[] + string?
    }[];
  }[];

  badges: {
    id: string;
    value: "People's Choice" | "Excellence" | "Community Impact";
    runnerUp: boolean;
    image: string;
  }[];
  tags: {
    id: string;
    name: string;
    mentions: number;
    projects: TProject[];
  }[];
  comments: {
    commentId: string;
    // projectId: string; // changed this from number to string
    userId: string; // userId would be set when a comment is created by getCurrentUser() which is an authenticated endpoint
    commentBody: string;
    parentId?: string; // changed this from number to stirng
    createdAt: string; // changed this to string since react can't deal with Date()
  }[];
};

export const mockProject: TMockProject = {
  _id: "1",
  name: "InceptionNet",
  blurb: "Building a neural network from scratch.",
  semester: { value: "S1 2023" },
  category: { value: "Web Development" },
  links: [
    {
      type: "github",
      value: "https://github.com/uoa-compsci399-s1-2023/project-team-1",
    },
  ],
  teamname: "Zuckerberg Enterprises",
  members: [],
  likes: 17,
  views: 52,
  banner: "src/components/projectPage/galleryImgs/Neural_Networks.png",
  content: [
    {
      tabName: "Overview",
      tabContent: [
        {
          type: "gallery",
          value: ["src/components/projectPage/galleryImgs/img1.png"],
        },
        {
          type: "text",
          subHeading: "Description",
          value: [
            `Deep Learning has become a popular topic in recent times. It involves emulating the neural structure of the human brain through a network of nodes called a Neural Network. While our brain's neurons have physical components like nucleus, dendrites, and synapses, Neural Network neurons are interconnected and have weights and biases assigned to them. A neural network typically consists of an input layer, an output layer, and one or more hidden layers. In conventional neural networks, all nodes in these layers are interconnected to form a dense network. However, there are cases where certain nodes in the network are not connected to others, which are referred to as Sparse Neural Networks. InceptionNet models for image classification use Sparse Neural Networks. The following figure illustrates the structure of a neural network.`,
          ],
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
          value: [
            `Deep Learning has become a popular topic in recent times. It involves emulating the neural structure of the human brain through a network of nodes called a Neural Network. While our brain's neurons have physical components like nucleus, dendrites, and synapses, Neural Network neurons are interconnected and have weights and biases assigned to them. A neural network typically consists of an input layer, an output layer, and one or more hidden layers. In conventional neural networks, all nodes in these layers are interconnected to form a dense network. However, there are cases where certain nodes in the network are not connected to others, which are referred to as Sparse Neural Networks. InceptionNet models for image classification use Sparse Neural Networks. The following figure illustrates the structure of a neural network.`,
          ],
        },
      ],
    },
  ],
  badges: [
    {
      id: "1",
      value: "Excellence",
      runnerUp: false,
      image: "",
    },
  ],
  comments: [
    {
      commentId: "0",
      userId: "0",
      commentBody: "This is a test comment",
      createdAt: "2022-08-16T23:00:33.010+02:00",
    },
    {
      commentId: "1",
      userId: "1",
      commentBody: "Daniel Ricciardo is a g",
      createdAt: "2021-05-16T23:00:33.010+02:00",
    },
    {
      commentId: "2",
      userId: "0",
      commentBody: "JK Charles Leclerc WDC 2023",
      parentId: "1",
      createdAt: "2021-10-16T23:00:33.010+02:00",
    },
    {
      commentId: "3",
      userId: "1",
      commentBody: "Nah Lando Norris at least one podium this year",
      parentId: "1",
      createdAt: "2021-08-16T23:00:33.010+02:00",
    },
    {
      commentId: "4",
      userId: "1",
      commentBody: "This is another test comment",
      parentId: "0",
      createdAt: "2022-08-16T23:00:33.010+02:00",
    },
    {
      commentId: "5",
      userId: "1",
      commentBody: "Daniel Ricciardo to Mercedes",
      parentId: "1",
      createdAt: "2022-08-16T23:00:33.010+02:00",
    },
  ],
  tags: [],
};
