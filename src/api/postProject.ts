import { API_URL } from "./config";

export async function postNewProject() {

    const response = await fetch(`${API_URL}/api/users/getCurrentUser/me`, {
        headers: {
            'x-auth-token': auth.getToken() as string
        }
    });
    if (response.status === 404 || response.status === 400) {
      return null
    }
    return response.json();
  }



//   {
//     "name": "InceptionNet",
//     "blurb": "Building a neural network from scratch.",
//     "semester": "S1 2023",
//     "category": "Web Development",
//     "links": [{
//       "type": "github",
//       "value": "https://github.com/uoa-compsci399-s1-2023/project-team-1"
//     }],
//     "teamname": "Zuckerberg Enterprises",
//     "banner": "src/components/projectPage/galleryImgs/Neural_Networks.png",
//     "content": [
//       {
//         "tabName": "Overview",
//         "tabContent": [
//           {
//             "type": "gallery", "value": ["src/components/projectPage/galleryImgs/img1.png"]
//           },
//           {
//             "type": "text",
//             "subHeading": "Description",
//             "value": ["Deep Learning has become a popular topic in recent times. It involves emulating the neural structure of the human brain through a network of nodes called a Neural Network. While our brain's neurons have physical components like nucleus, dendrites, and synapses, Neural Network neurons are interconnected and have weights and biases assigned to them. A neural network typically consists of an input layer, an output layer, and one or more hidden layers. In conventional neural networks, all nodes in these layers are interconnected to form a dense network. However, there are cases where certain nodes in the network are not connected to others, which are referred to as Sparse Neural Networks. InceptionNet models for image classification use Sparse Neural Networks. The following figure illustrates the structure of a neural network."]
//           }
//         ]
//       },
//       {
//         "tabName": "Breakdown",
//         "tabContent": [
//           {
//             "type": "text",
//             "subHeading": "Description",
//             "value": ["Deep Learning has become a popular topic in recent times. It involves emulating the neural structure of the human brain through a network of nodes called a Neural Network. While our brain's neurons have physical components like nucleus, dendrites, and synapses, Neural Network neurons are interconnected and have weights and biases assigned to them. A neural network typically consists of an input layer, an output layer, and one or more hidden layers. In conventional neural networks, all nodes in these layers are interconnected to form a dense network. However, there are cases where certain nodes in the network are not connected to others, which are referred to as Sparse Neural Networks. InceptionNet models for image classification use Sparse Neural Networks. The following figure illustrates the structure of a neural network."]
//           }
//         ]
//       }
//     ],
//     "badges": "Peoples Choice"
//   }  