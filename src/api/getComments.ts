import { API_URL } from "./config";

export type TComment = {
  id: string;
  projectId: string;
  userId: string;
  commentBody: string;
  parentComment?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export async function getComments(): Promise<TComment[]> {
  const response = await fetch(`${API_URL}/api/projects/comments/all`);
  return response.json();
}
