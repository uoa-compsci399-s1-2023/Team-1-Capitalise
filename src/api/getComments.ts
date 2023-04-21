import { API_URL } from "./config";

export type TComment = {
  id: string;
  projectId: string;
  commentBody: string;
  parentComment?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: {
    email: string;
    name: string;
    profilePicture: string;
    username?: string;
    id: string;
  };
};

export async function getComments(): Promise<TComment[]> {
  const response = await fetch(`${API_URL}/api/projects/comments/all`);
  return response.json();
}
